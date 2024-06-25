
from datetime import datetime
import os
from typing import Optional
from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy import text
from sqlalchemy.orm import Session


from app.configs.database import get_db, get_db2
from app.configs import models
from . import schemas
from .schemas import GetItemsParams



item_router = APIRouter()    


def get_part_number_name(operation_number: int, db2: Session):

    baufnr = int(str(operation_number)[:6])
    pos = int(str(operation_number)[-3:])
    
    raw_query = """
    SELECT bauf.bauf_artnr AS Partnumber, bauf.bauf_artbez AS Partname 
    FROM bauf 
    WHERE bauf.bauf_aufnr = :baufnr AND bauf.bauf_posnr = :pos 
    LIMIT 1;
    """
    result = db2.execute(text(raw_query), {"baufnr": baufnr, "pos": pos})
    item = result.fetchone()

    if item:
        return dict(item)
    else:
        return None


@item_router.get('/', status_code=status.HTTP_200_OK)
async def get_items(params: GetItemsParams = Depends(GetItemsParams),
                    db: Session = Depends(get_db),
                    db2: Session = Depends(get_db2)):   

    skip = (params.page - 1) * params.limit

    query = db.query(models.Items)

    if params.from_date:
        query = query.filter(models.Items.date >= params.from_date)

    if params.to_date:
        query = query.filter(models.Items.date <= params.to_date)

    if params.status:
        query = query.filter(models.Items.status == params.status)

    if params.ma:
        query = query.filter(models.Items.ma == params.ma)

    if params.machine:
        query = query.filter(models.Items.machine.contains([params.machine]))

    if params.sortBy:
        query = query.order_by(text(f'{params.sortBy} {params.sortOrder}'))

    if params.toArticle:
        query = query.filter(models.Items.partnr == params.toArticle)

    items = query.limit(params.limit).offset(skip).all()

    data = []

    for i in items:
        notes = db.query(models.Notes.note, models.Notes.created_at).filter(models.Notes.item_id == i.id).all()

        notes = [{'note': note, 'created_at': created_at} for note, created_at in notes]

        # part_info = get_part_number_name(i.operation_order_number, db2)
        # print(1)
        # print(part_info)
        # print(1)
        # if part_info:
        #     partnr = part_info.get('Partnumber')
        #     partname = part_info.get('Partname')
        # else:
        #     partnr = partname = None

        print('00000')
        print(i)
        print('00000')

        item = {
            'id': i.id, 'date': i.date, 'ma': i.ma, 'machine': i.machine,
            'notes': notes, 'image': i.image, 'status': i.status,
            'partnr': i.partnr, 'partname': i.partname,
        }
        data.append(item)

    all_items = len(query.all())
    return {'status': status.HTTP_200_OK, 'results': len(items), "length": all_items, 'items': data}


@item_router.get('/ma', status_code=status.HTTP_200_OK)
async def get_items_ma(db: Session = Depends(get_db)):
    ma = db.query(models.Items.ma).distinct().all()

    ma = [i['ma'] for i in ma]

    return {'status': status.HTTP_200_OK, 'ma': ma}


@item_router.post('/', status_code=status.HTTP_201_CREATED)
async def create_item(payload: schemas.ItemBaseSchema = Depends(schemas.ItemBaseSchema.as_form),
                      file: Optional[UploadFile] = File(None),
                      db: Session = Depends(get_db)):
    date = datetime.now().strftime('%Y/%m')
    dirs = f'assets/files/{date}'

    os.makedirs(dirs, exist_ok=True)
    data = payload.dict()

    if file:
        content = file.file.read()

        with open(f'{dirs}/{file.filename}', 'wb') as out_file:
            out_file.write(content)

        data['image'] = f'{dirs}/{file.filename}'

    notes = data.pop('notes')

    new_item = models.Items(**data)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    note_data = [models.Notes(item_id=new_item.id, note=i) for i in notes]
    db.bulk_save_objects(note_data)
    db.commit()
    db.refresh(new_item)
    return await get_item(item_id=new_item.id, db=db)


@item_router.patch('/{item_id}', status_code=status.HTTP_200_OK)
async def update_item(item_id: int, payload: schemas.UpdateItemSchema = Depends(schemas.UpdateItemSchema.as_form),
                      db: Session = Depends(get_db)):
    note_data = [models.Notes(item_id=item_id, note=i) for i in payload.notes]
    db.bulk_save_objects(note_data)

    db.commit()
    return await get_item(item_id=item_id, db=db)


@item_router.get('/{item_id}', status_code=status.HTTP_200_OK)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Items).filter(
        models.Items.id == item_id).first()
    notes = db.query(models.Notes.note, models.Notes.created_at).filter(models.Notes.item_id == item_id).all()

    notes = [{'note': i[0], 'created_at': i[1]} for i in notes]

    item = {'id': item.id, 'ma': item.ma, 'machine': item.machine, 'notes': notes, 'image': item.image,
            'status': item.status}

    return {'status': status.HTTP_200_OK, 'item': item}


@item_router.delete('/{item_id}', status_code=status.HTTP_200_OK)
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    db.query(models.Items).filter(models.Items.id == item_id).delete()
    return {'status': status.HTTP_200_OK, 'message': f'Item deleted!'}

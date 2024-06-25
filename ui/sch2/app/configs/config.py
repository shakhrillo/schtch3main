class Settings():
    db_host: str = "192.168.100.21"
    db_password: str ="K7q1E6p8x"
    db_port: int ="3306"
    db_user: str ="qqdb_web"
    db_name: str ="schichtbuch" 

    db2_host: str = "192.168.100.21"
    db2_password: str ="K7q1E6p8x"
    db2_port: int ="3306"
    db2_user: str ="qqdb_web"
    db2_name: str ="alfaplus" 

    class Config:
        env_file = ".env"

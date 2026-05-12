from .sqlite_commands import SQLiteCommands
from .sqlite_queries import SQLiteQueries

class SQLiteDatabase:

    def __init__(self, db_path: str):
        self.command = SQLiteCommands(db_path)
        self.query   = SQLiteQueries(db_path)
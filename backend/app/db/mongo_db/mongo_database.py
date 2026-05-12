from .mongo_commands import MongoCommands
from .mongo_queries import MongoQueries

class MongoDatabase:

    def __init__(self, mongo_url: str):
        self.command = MongoCommands(mongo_url)
        self.query   = MongoQueries(mongo_url)
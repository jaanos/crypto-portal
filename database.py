import auth
import MySQLdb

class Database:
    db = None

    def dbcon(self):
        if self.db == None or not self.db.open:
            self.db = MySQLdb.connect(host=auth.dbhost, user=auth.dbuser,
                                        passwd=auth.dbpass, db=auth.dbase)
        return self.db

database = Database()

import auth
import MySQLdb

class Database:
    db = None

    def dbcon(self):
        try:
            self.db.ping()
        except:
            self.db = MySQLdb.connect(host=auth.dbhost, user=auth.dbuser,
                                        passwd=auth.dbpass, db=auth.dbase,
                                        charset = 'utf8', use_unicode = True)
        return self.db

database = Database()

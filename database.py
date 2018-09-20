import auth
import MySQLdb

class DummyCursor:
    def close(self):
        return

    def execute(self, *largs):
        return

    def fetchall(self):
        return []

    def fetchone(self):
        return ()

    def __iter__(self):
        return iter([])

class DummyDB:
    cur = DummyCursor()

    def cursor(self):
        return self.cur

    def close(self):
        return
    
    def commit(self):
        return

class Database:
    db = None
    dummy = DummyDB()

    def dbcon(self):
        try:
            try:
                self.db.ping()
            except:
                #CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
                #GRANT ALL privileges ON *.* TO 'username'@'localhost'  identified BY 'password';
                #CREATE USER 'mia'@'localhost';
                #GRANT ALL privileges ON *.* TO 'mia'@'localhost';
                #FLUSH privileges;
                #mysql < "psola.sql"
                #in mysql in terminal
                self.db = MySQLdb.connect(host=auth.dbhost, user=auth.dbuser,
                                            passwd=auth.dbpass, db=auth.dbase,
                                            charset = 'utf8', use_unicode = True)
                cursor = self.db.cursor () 
                cursor.execute("SELECT VERSION()") 
                row = cursor.fetchone() 
                print("server version:", row[0] )
                print("DATABASE")
        except MySQLdb.Error as e:
            print ("Error %d: %s" % (e.args[0], e.args[1]))
            return self.dummy
            
        return self.db

database = Database()

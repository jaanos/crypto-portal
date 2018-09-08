
class Annotate(object):
    """
    Annotating html text for translating.
    1. <h1>File Not Found</h1> -- ><h1>{{ _('File Not Found') }}</h1>
    2. <p>New User? <a href="{{ url_for('register') }}">Click to Register!</a></p> -->
       <p>{{ _('New User?') }} <a href="{{ url_for('register') }}">{{ _('Click to Register!') }}</a></p>
    3. {{ user.followers.count() }} followers -- > {{ _('%(count)d followers', count=user.followers.count()) }}

    """ 
    def parseHTML(html):
        pass

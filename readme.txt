Toggle Environments
Copyright (c) 2015 Trevor Orr
http://locusinteractive.net


Toggle a tab between development url's.  Go from the development url to the stage url to the live url.  It retains the current path and url parameters when switching environments.  The current environment is automatically detected and the other environments are then displayed as options to choose to go to.

Defaults to .com for top level domain.  It now has the option for 3 different top level domain extensions and the domains for each extension.


EG: 
Go from: 

http://somesite.localhost/some/path?abc=123&xyz=789

To:

http://somesite.dev.mydomain.com/some/path?abc=123&xyz=789

To:

http://somesite.stage.mydomain.com/some/path?abc=123&xyz=789

To:

http://www.somesite.com/some/path?abc=123&xyz=789

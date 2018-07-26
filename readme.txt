
why we need this?
-1: some time, we want to test some javascript , just js ,no dom ,but currently, we don't 
    have some tools to test it, we need write a html, and import that js to test it, that
    waste our time
-2: right now , we provide a command line to run the javascript, we don't need launch a browser
    any more to test pure JS logic.
-3: provide a  possible to do CI for front-end UT ,even IT(integration testing) in the future.
 
How to use it?
-1: set the basePath in bin\run_all_tests.bat , bin\run_test.bat
    like --basePath="c:/wamp1/www/open/lib"
         set dirList = "c:/wamp1/www/open/lib/tests/specs"
-2: cmd: goto the EnvJasmine rootDir, like cd D:\alibaba\EnvJasmine
-3: run: bin\run_test.bat tests\specs\classInheritTest.spec.js
    like: D:\alibaba\EnvJasmine>bin\run_test.bat tests\specs\classInheritTest.spec.js
-4: if run all ut, run: bin\run_all_tests.bat
    like: D:\alibaba\EnvJasmine>bin\run_all_tests.bat

Who could use it?
any one who need run JS, test JS logic

what's the project and specs dirs?
   --basepath       
          --lib
          --src
          --tests
             --specs
             --mocks

TODO List:
-1: support HTML fragment test
-2: Integratin testing for component

Hot to get help?
 Email: 
 qijun.weiqj@alibaba-inc.com
 zhouquan.yezq@alibaba-inc.com             

Based on info from:
    * "EnvJasmine": https://github.com/trevmex/EnvJasmine
    * "JavaScript BDD, with Jasmine, without a browser":http://www.build-doctor.com/2010/12/08/javascript-bdd-jasmine/
    * "Rhino":http://www.mozilla.org/rhino/
    * "EnvJS":http://www.envjs.com/
    * "Jasmine":https://jasmine.github.io/
    * "Jasmine Jquery":https://github.com/velesin/jasmine-jquery

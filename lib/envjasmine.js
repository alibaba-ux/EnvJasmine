/*
 EnvJasmine: Jasmine test runner for EnvJS.

 EnvJasmine allows you to run headless JavaScript tests.

 Based on info from:
 http://agile.dzone.com/news/javascript-bdd-jasmine-without
 http://www.mozilla.org/rhino/
 http://www.envjs.com/
 http://pivotal.github.com/jasmine/
 https://github.com/velesin/jasmine-jquery
*/

importPackage(java.lang);
importPackage(java.io);
importPackage(org.mozilla.javascript);

// Create the EnvJasmine namespace
if (!this.EnvJasmine) {
    this.EnvJasmine = {};
}

EnvJasmine.cx = Context.getCurrentContext();
EnvJasmine.cx.setOptimizationLevel(-1);
EnvJasmine.topLevelScope = this;

EnvJasmine.about = function () {
    print("usage: envjasmine.js [options] [spec_file...]");
    print("");
    print("options:");
    print("     --configFile=<File>         Set a config file to run before specs are executed");
    print("     --disableColor              Disable console colors (colors are not available in Windows)");
    print("     --environment=<WIN|UNIX>    Set the environment to UNIX or Windows");
    print("     --help                      This list");
    print("     --incrementalOutput         Disable the ./F output and print results for each spec file");
    print("     --rootDir=<Dir>             Set the EnvJasmine root directory (REQUIRED)");
    print("     --suppressConsoleMsgs       Suppress window.console messages");
    print("     --testDir=<Dir>             Set the directory with the specs/ directory (REQUIRED)");
    print("     --customSpecsDir=<Dir>     Sets the name of the specs directory, default is 'specs'");
};

EnvJasmine.normalizePath = function(path) {
    var endsInSlash = (path.slice(-1) == "/");

    if (path.slice(0, 1) == ".") {
        path = EnvJasmine.rootDir + "/" + path;
    }

    return File(path).getCanonicalPath() + (endsInSlash ? "/" : "");
};
importJS=function(relativePath) {
  EnvJasmine.load(EnvJasmine.basePath + "/"+relativePath);
}
EnvJasmine.loadFactory = function(scope) {
    return function (path) {
        var fileIn,
            normalizedPath = EnvJasmine.normalizePath(path);

        try {
            //print("<<<<<<<<<<<<<<<<<<<<<path:>>>>>>>>>>>>>>> "+normalizedPath);
            fileIn = new FileReader(normalizedPath);
            EnvJasmine.cx.evaluateReader(scope, fileIn, normalizedPath, 0, null);
        } catch (e) {
            print('Could not read file: ' + normalizedPath );
        } finally {
            fileIn.close();
        }
    };
};
EnvJasmine.loadGlobal = EnvJasmine.loadFactory(EnvJasmine.topLevelScope);

EnvJasmine.setRootDir = function (rootDir) {
    // These are standard directories in the EnvJasmine project.
    print("rootDir:"+rootDir);
    EnvJasmine.rootDir = EnvJasmine.normalizePath(rootDir);
    EnvJasmine.libDir = EnvJasmine.normalizePath(EnvJasmine.rootDir + "/lib/");
    EnvJasmine.includeDir = EnvJasmine.normalizePath(EnvJasmine.rootDir + "/include/");
    print("EnvJasmine.includeDir: "+EnvJasmine.includeDir);
    // This is the standard spec suffix
    EnvJasmine.specSuffix = new RegExp(/.spec.js$/);

    // Load the default dirs and files, these can be overridden with command line options
    EnvJasmine.configFile = EnvJasmine.normalizePath(EnvJasmine.includeDir + "dependencies.js");
};

EnvJasmine.setTestDir = function (testDir, override) {
    if (typeof EnvJasmine.testDir === "undefined" || !EnvJasmine.testDir || override) {
        EnvJasmine.testDir = EnvJasmine.normalizePath(testDir);
        EnvJasmine.mocksDir = EnvJasmine.normalizePath(EnvJasmine.testDir + "/mocks/");
        EnvJasmine.specsDir = EnvJasmine.normalizePath(EnvJasmine.testDir + "/specs/");
    }
};
//add by zhouquan.yezq 4/21/2012, so we set the base path for the project.
/*
*   --basepath       C:\wamp1\www\open
*          --lib
*          --src
*          --tests
*              --specs
*              --mocks
*/
EnvJasmine.setBasepath=function(basePath) {
   print("basePath:======="+basePath);
   if(basePath=='.'){
       EnvJasmine.basePath=EnvJasmine.rootDir;
       EnvJasmine.currentDir=true;
   }else{
      EnvJasmine.currentDir=false;
      EnvJasmine.basePath=basePath;
   }
   EnvJasmine.testDir = EnvJasmine.normalizePath(EnvJasmine.basePath);
   EnvJasmine.mocksDir = EnvJasmine.normalizePath(EnvJasmine.testDir + "/tests/mocks/");
   EnvJasmine.specsDir=EnvJasmine.normalizePath(EnvJasmine.testDir+"/tests/specs/");

}

// Process command line options
var t;
if(!EnvJasmine.currentDir){
    t=arguments[1];
    try{
        if(t && t.split){
            t=t.split("bin");
            t=t[0].split("=")[1];
            t=arguments[3].split(t);
            t=t[1];
        }
    }catch(e){print(t)}
}

(function(argumentList) {
    var arg, nameValue, spec = "", specLoc;
    print("++++start+++");
    EnvJasmine.specs = [];
    EnvJasmine.passedCount = 0;
    EnvJasmine.failedCount = 0;
    EnvJasmine.totalCount = 0;

    for (var i = 0; i < argumentList.length; i++) {
        arg = argumentList[i];
        if (arg.slice(0, 2) == "--") {
            nameValue = arg.slice(2).split('=');

            switch(nameValue[0]) {
                case "testDir":
                    //EnvJasmine.setTestDir(nameValue[1], true);
                    break;
                case "basePath":
                    EnvJasmine.setBasepath(nameValue[1],true);
                    break;
                case "rootDir":
                    EnvJasmine.setRootDir(nameValue[1]);
                    //EnvJasmine.setTestDir(nameValue[1]); // Set the root as the default testDir.
                    break;
                case "environment":
                    EnvJasmine.environment = nameValue[1];
                    break;
                case "configFile":
                    EnvJasmine.configFile = EnvJasmine.normalizePath(nameValue[1]);
                    break;
                case "disableColor":
                    EnvJasmine.disableColorOverride = true;
                    break;
                case "incrementalOutput":
                    EnvJasmine.incrementalOutput = true;
                    break;
                case "suppressConsoleMsgs":
                    EnvJasmine.suppressConsoleMsgs = true;
                    break;
                case "customSpecsDir":
                    EnvJasmine.customSpecsDir = nameValue[1];
                    break;
                case "help":
                    EnvJasmine.about();
                    System.exit(0);
                default:
                    print("Unknown option: " + arg);
                    break;
            }
        } else {
            if (arg.slice(-3) !== ".js" && arg.slice(-5) !== ".html") {
                print(arg);
                spec += arg + " ";
            } else {
                spec += arg;
                if (arg[0] === "/" || (arg[1] === ":" && arg[2] === "\\")) {
                    specLoc = spec;
                } else {
                    specLoc = EnvJasmine.testDir + "/" + spec
                }
                if(EnvJasmine.currentDir){
                    specLoc = spec;
                }else{
                    specLoc=EnvJasmine.basePath+"/"+t;
                }
                EnvJasmine.specs.push(EnvJasmine.normalizePath(specLoc));
                spec = "";
            }
        }
    }
}(arguments));

if (typeof EnvJasmine.customSpecsDir !== "undefined") {
    EnvJasmine.specsDir = EnvJasmine.normalizePath(EnvJasmine.testDir + EnvJasmine.customSpecsDir);
}

if (typeof EnvJasmine.rootDir == "undefined" || typeof EnvJasmine.environment == "undefined") {
    print("EnvJasmine.rootDir:"+EnvJasmine.rootDir);
    EnvJasmine.about();
    System.exit(1);
}

EnvJasmine.SEPARATOR = (function (env) {
    if (env == "UNIX") {
        return "/";
    } else if  (env == "WIN") {
        return "\\";
    } else {
        print("+++++++++++++SEPARATOR++++++++++");
        EnvJasmine.about();
        System.exit(1);
    }
}(EnvJasmine.environment));

EnvJasmine.disableColor = (function (env) {
    return EnvJasmine.disableColorOverride || (env == "WIN");
}(EnvJasmine.environment));

(function() {
    if (EnvJasmine.disableColor) {
        EnvJasmine.green = function(msg) { return msg; };
        EnvJasmine.red = function(msg) { return msg; };
        EnvJasmine.plain = function(msg) { return msg; };
    } else {
        var green = "\033[32m",
            red = "\033[31m",
            end = "\033[0m";

        EnvJasmine.green = function(msg) { return green + msg + end; };
        EnvJasmine.red = function(msg) { return red + msg + end; };
        EnvJasmine.plain = function(msg) { return msg; };
    }
}());
EnvJasmine.results = [];

EnvJasmine.loadConfig = function () {
    EnvJasmine.loadGlobal(EnvJasmine.configFile);
};

(function() {
    var i, fileIn, len;

    EnvJasmine.loadConfig();
    
    if (typeof EnvJasmine.reporterClass === "undefined") {
    	// Use the standard reporter
    	EnvJasmine.reporterClass = RhinoReporter;
    }
    

    jasmine.getEnv().addReporter(new EnvJasmine.reporterClass());

    if (EnvJasmine.suppressConsoleMsgs === true) {
        // suppress console messages
        window.console = $.extend({}, window.console, {
            info: jasmine.createSpy(),
            log: jasmine.createSpy(),
            debug: jasmine.createSpy(),
            warning: jasmine.createSpy(),
            error: jasmine.createSpy()
        });
    }

    EnvJasmine.loadGlobal(EnvJasmine.libDir + "spanDir/spanDir.js");
    if (EnvJasmine.specs.length == 0) {
        spanDir(EnvJasmine.specsDir, function(spec) {
            if (EnvJasmine.specSuffix.test(spec)) {
                EnvJasmine.specs.push(spec);
            }
        });
    }

    for (i = 0, len = EnvJasmine.specs.length >>> 0; i < len; i += 1) {
        try {
            EnvJasmine.currentScope = {};
            EnvJasmine.load = EnvJasmine.loadFactory(EnvJasmine.currentScope);
            EnvJasmine.specFile = EnvJasmine.specs[i];            
            var reg=new RegExp(/.html$/);
            fileIn = new FileReader(EnvJasmine.specFile);
            if(reg.test(EnvJasmine.specFile)){
                print("test html , this feature will be add in the future.");
                //window.location.href="file://C:/wamp1/www/open/lib/tests/specs/index.html";
                //print(EnvJasmine.rootDir);
                //window.location = "file:///C:/wamp1/www/open/lib/tests/specs/index.html";
            }else{
              EnvJasmine.cx.evaluateReader(EnvJasmine.currentScope, fileIn, EnvJasmine.specs[i], 0, null);
              EnvJasmine.cx.evaluateString(EnvJasmine.currentScope, 'window.location.assign(["file://", EnvJasmine.libDir, "envjasmine.html"].join(EnvJasmine.SEPARATOR));', 'Executing '+EnvJasmine.specs[i], 0, null);
            }
        }
        finally {
            fileIn.close();
        }
    }

    if (EnvJasmine.results.length > 0) {
        print("\n");
        print(EnvJasmine.red(EnvJasmine.results.join("\n\n")));
    }

    print();
    print(EnvJasmine[EnvJasmine.passedCount ? 'green' : 'plain']("Passed: " + EnvJasmine.passedCount));
    print(EnvJasmine[EnvJasmine.failedCount ? 'red' : 'plain']("Failed: " + EnvJasmine.failedCount));
    print(EnvJasmine.plain("Total : " + EnvJasmine.totalCount));

    if (EnvJasmine.failedCount > 0) {
        System.exit(1);
    }
}());

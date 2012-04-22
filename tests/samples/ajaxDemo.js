// This is the contents of ajaxDemo.js, the file to test.
var TwitterWidget = {
    makeRequest: function() {
        var self = this;
        
      var t=  jQuery.ajax({
            url: "http://api.twitter.com/1/statuses/show/trevmex.json",
            success: function (data) {
                TwitterWidget.addDataToDOM(data);
            },error: function(){
                TwitterWidget.onError();
            }
        });
        return t;
    },

    addDataToDOM: function(data) {
        // does something
        // We will mock this behavior with a spy.
        
        return data;
    },
    onError: function(){

    }
};

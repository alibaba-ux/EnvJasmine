// Load the file to test here.
//
// Example:
importJS("include/jquery-1.7.1.js");
importJS("tests/samples/ajaxDemo.js");
// This is the test code.
describe("AjaxDemo", function () {
    it("calls the addDataToDOM function on success", function () {
        jasmine.Ajax.useMock();
        jasmine.Ajax.installMock();
        var jqxhr=TwitterWidget.makeRequest(); // Make the AJAX call
        print(jqxhr.xhr.success);
        spyOn(TwitterWidget, "addDataToDOM"); // Add a spy to the callback

        mostRecentAjaxRequest().response({status: 200, responseText: "foo",xhr:jqxhr.xhr}); // Mock the response

        expect(TwitterWidget.addDataToDOM).toHaveBeenCalledWith("foo");
    });

    it("calls the  onError function on failed", function () {
        jasmine.Ajax.useMock();
        jasmine.Ajax.installMock();
        var jqxhr=TwitterWidget.makeRequest(); // Make the AJAX call
        print(jqxhr.xhr.success);
        spyOn(TwitterWidget, "onError"); // Add a spy to the callback

        mostRecentAjaxRequest().response({status: 500, responseText: "foo",xhr:jqxhr.xhr}); // Mock the response

        expect(TwitterWidget.onError).toHaveBeenCalled();
    });
});

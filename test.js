import * as api from "./api.js";

QUnit.module("test to see if it", function() {
    QUnit.test("works", function(assert) {
        assert.equal(true, true);
    });

    QUnit.test("doesn't work", function(assert) {
        assert.equal(true, false);
    });
});
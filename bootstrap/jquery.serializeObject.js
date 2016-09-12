
jQuery.fn.serializeObject = function()
{
    var o = {};
    var re = /^(.+)\[(.*)\]$/;
    var a = this.serializeArray();
    var n;
    jQuery.each(a, function() {
        var name = this.name;
        if ((n = re.exec(this.name)) && n[2]) {
            if (o[n[1]] === undefined) {
                o[n[1]] = {};
                o[n[1]][n[2]] = this.value || '';
            } else if (o[n[1]][n[2]] === undefined) {
                o[n[1]][n[2]] = this.value || '';
            } else {
                if(!o[n[1]][n[2]].push) {
                    o[n[1]][n[2]] = [ o[n[1]][n[2]] ];
                }
                o[n[1]][n[2]].push(this.value || '');
            }
        } else {
            if (n && !n[2]) {
                name = n[1];
            }
            if (o[name] !== undefined) {
                if (!o[name].push) {
                    o[name] = [o[name]];
                }
                o[name].push(this.value || '');
            } else {
                o[name] = this.value || '';
            }
        }
    });
    return o;
};

 jQuery.fn.deserialize = function (data) {
        var f = jQuery(this),
            map = {},
            find = function (selector) { return f.is("form") ? f.find(selector) : f.filter(selector); };
        //Get map of values
        jQuery.each(data.split("&"), function () {
            var nv = this.split("="),
                n = decodeURIComponent(nv[0]),
                v = nv.length > 1 ? decodeURIComponent(nv[1]) : null;
            if (!(n in map)) {
                map[n] = [];
            }
            map[n].push(v);
        })
        //Set values for all form elements in the data
        jQuery.each(map, function (n, v) {
            find("[name='" + n + "']").val(v);
        })
        //Clear all form elements not in form data
        find("input:text,select,textarea").each(function () {
            if (!($(this).attr("name") in map)) {
                $(this).val("");
            }
        })
        find("input:checkbox:checked,input:radio:checked").each(function () {
            if (!($(this).attr("name") in map)) {
                this.checked = false;
            }
        })
        return this;
 };
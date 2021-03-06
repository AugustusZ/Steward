/**
 * @file del command script
 * @description delete extensions / apps by del command
 * @author  tomasy
 * @mail solopea@gmail.com
 */

define(function (require, exports, module) {
    var name = 'calculate';
    var version = 1;
    var key = 'calc';
    var icon = chrome.extension.getURL('img/calc.png');
    var title = chrome.i18n.getMessage(name + '_title');
    var subtitle = chrome.i18n.getMessage(name + '_subtitle');
    var commands = [{
        key,
        title,
        subtitle,
        icon,
        editable: false
    }];

    function onInput(key) {
        var data = [];
        if (this.term.startsWith('calc ') && key) {
            this.render(key);
            return;
        }
        try {
            result = eval(this.str);
            data = [
                {
                    key: title,
                    icon: icon,
                    title: result,
                    desc: subtitle

                }
            ];
        }
        catch (e) {}

        return data;
    }

    function onEnter(id) {
    }

    module.exports = {
        version,
        name: 'Calculator',
        icon,
        title,
        commands,
        onInput: onInput,
        onEnter: onEnter

    };
});

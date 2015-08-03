bobToolkit = function() {};

bobToolkit.prototype =
{

    assign : function(clientId, val)
    {
        if (!(!clientId || '' == clientId || 'undefined' === typeof(clientId)))
        {
            var id = $( "#" + clientId.replace( /(:|\.|\[|\])/g, "\\$1" ) );
            var tagName = id.get(0).tagName;
            if ('' == val)
            {
                val = String.fromCharCode(160);
            }
            switch (true)
            {
                case (-1 != tagName.toUpperCase().lastIndexOf('span'.toUpperCase())):
                    id.text(val);
                    break;
                default:
                    alert('Unrecognized HTML tag: ' + tagName);
                    break;
            }
        }
    }

};

var _bobToolkit = new bobToolkit();
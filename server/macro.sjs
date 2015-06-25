macro View {
    rule {
        ($params ...) { $body:stmt ... }
    } => {
        function ($params ...) {
            var output = [];
            $body ...
            return output.join('');
        }
    }
}

macro stmt {
    rule {
        html { $body:stmt ... }
    } => {
        output.push('<!DOCTYPE html><html>');
        $body ...
        output.push('</html>');
    }
    rule {
        head { $body:stmt ... }
    } => {
        output.push('<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />');
        $body ...
        output.push('</head>');
    }
    rule {
        body { $body:stmt ... }
    } => {
        output.push('<body>');
        $body ...
        output.push('</body>');
    }
    rule {
        @ $s:expr;
    } => {
        output.push($s);
    }
    rule {
        var $var:ident = @ { $body:stmt ... };
    } => {
        var t = output;
        output = [];
        $body ...
        var $var = output.join('');
        output = t;
    }
    rule {
        $name:tagName $id:tagId $class:tagClassList $attrList:attrList { $body:stmt ... }
    } => {
        output.push('<', $name $id $class $attrList , '>');
        $body ...
        output.push('</', $name, '>');
    }
    rule {
        $name:tagName $id:tagId $class:tagClassList $attrList:attrList;
    } => {
        output.push('<', $name $id $class $attrList , ' />');
    }
    rule {
        if $a { $b:stmt ... } else $c:stmt
    } => {
        if $a { $b ... } else { $c }
    }
    rule {
        if $a { $b:stmt ... } else { $c:stmt ... }
    } => {
        if $a { $b ... } else { $c ... }
    }
    rule {
        if $a { $b:stmt ... }
    } => {
        if $a { $b ... }
    }
    rule {
        for $a { $b:stmt ... }
    } => {
        for $a { $b ... }
    }
    rule {
        var $a ... ;
    } => {
        var $a ... ;
    }
    rule {
        return $x ... ;
    } => {
        return $x ... ;
    }
    rule { ## { $x ... } } => { { $x ... } }
}

macro tagName {
    case { _ $name:ident } => {
        var syn = #{$name};
        return [makeValue(unwrapSyntax(syn[0]), syn)];
    }
}

macro tagId {
    case {
        _ # $id:ident
    } => {
        var syn = #{$id};
        return [makePunc(',', null),
            makeValue(' id="' + unwrapSyntax(syn[0]) + '"', syn)];
    }
    rule {} => {}
}

macro tagClassList {
    case {
        _ $class:tagClass ...
    } => {
        var syn = #{$class ...};
        if (syn.length === 0) return [];
        return [makePunc(',', null),
            makeValue(' class="' + syn.map(unwrapSyntax).join(' ') + '"', null)];
    }
    rule {} => {}
}

macro tagClass {
    rule {
        . $className:ident
    } => {
        $className
    }
}

macro attrList {
    rule {
        ( $attr:attr (,) ... )
    } => {
        $attr ...
    }
    rule {} => {}
}

macro attr {
    case {
        _ $($attrName = $attrVal:expr)
    } => {
        var syn = #{$attrName};
        letstx $attr = [makeValue(' ' + unwrapSyntax(syn[0]) + '="', syn)];
        return #{
            , $attr, $attrVal, '"'
        };
    }
    rule {
        $attr:expr
    } => {
        , $attr
    }
}

export View;
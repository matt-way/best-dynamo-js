// Main rule that parses multiple key conditions combined with 'and'
KeyConditions
  = head:KeyCondition tail:(_ "and" _ KeyCondition)* {
      return [head, ...tail.map(([, , , condition]) => condition)];
    }

// Single key condition rule
KeyCondition
  = attribute:Attribute _ operator:Operator _ values:ValueRange {
      return {
        attribute: attribute,
        operator: operator,
        values: values
      };
    }

// Attribute names
Attribute
  = $([a-zA-Z_][a-zA-Z0-9_]*)

// Operators including between which handles a special case
Operator
  = "=" / "<" / ">" / "<=" / ">=" / "between"

// Handling value range especially for between which needs two values
ValueRange
  = operator:("between"i) _ first:Value _ "and" _ second:Value {
      // When 'between' is used, return an array with two values
      return [first, second];
  }
  / value:Value {
      // For a single value, wrap it in an array to maintain consistency
      return [value];
  }

// Values can be numbers or quoted strings
Value
  = Number
  / QuotedString

// Number parsing
Number
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

// String parsing, handles both single and double quoted strings
QuotedString
  = "'" chars:[^']* "'" { return chars.join(""); }
  / '"' chars:[^"]* '"' { return chars.join(""); }

// Optional whitespace
_ "whitespace"
  = [ \t\n\r]*
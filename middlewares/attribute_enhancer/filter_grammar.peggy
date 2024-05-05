// Main entry point for parsing filter expressions
FilterExpression
  = head:Expression tail:(_ LogicalOperator _ Expression)* {
      return tail.reduce(function(result, element) {
        return { type: element[1], conditions: [result, element[3]] };
      }, head);
    }

// Handle expression with or without parentheses
Expression
  = "(" _ expr:FilterExpression _ ")" { return expr; } // Handling expressions within parentheses
  / Condition

// Conditions that can be combined with logical operators
Condition
  = attribute:Attribute _ operator:ComparisonOperator _ values:ValueList {
      return {
        attribute: attribute,
        operator: operator,
        values: values
      };
    }

// Attribute names, handling more complex identifiers
Attribute
  = $([a-zA-Z_][a-zA-Z0-9_]*) // Supports underscores and numbers within attribute names

// Logical operators
LogicalOperator
  = "AND"i { return "and"; }
  / "OR"i { return "or"; }

// Comparison operators
ComparisonOperator
  = "=" { return "="; }
  / "!=" { return "!="; }
  / "<" { return "<"; }
  / ">" { return ">"; }
  / "<=" { return "<="; }
  / ">=" { return ">="; }
  / "between"i { return "between"; }
  / "contains"i { return "contains"; }
  / "not contains"i { return "notContains"; }
  / "begins with"i { return "beginsWith"; }

// Handling values, supporting single values, or two values for 'between'
ValueList
  = operator:("between"i) _ first:Value _ "and" _ second:Value {
      return [first, second]; // Always returns an array of two values for 'between'
  }
  / value:Value {
      return [value]; // Wraps single value in an array for consistency
  }

// Values can be numbers, quoted strings, or unquoted text (for attributes in functions)
Value
  = Number
  / QuotedString

// String parsing with both single and double quotes
QuotedString
  = "'" chars:[^']* "'" { return chars.join(''); }
  / '"' chars:[^"]* '"' { return chars.join(''); }

// Number parsing
Number
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

// Optional whitespace
_ "whitespace"
  = [ \t\n\r]* // Modified to be more flexible in matching spaces

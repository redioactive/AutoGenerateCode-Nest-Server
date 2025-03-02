/**
* {{classComment}}
*/
interface {{className}} {
{{#fieldList}}
  // {{comment}}
  {{fieldName}}: {{typescriptType}};
{{/fieldList}}
}
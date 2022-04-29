cwlVersion: v1.0
class: CommandLineTool

requirements: []

hints:
  - class: DockerRequirement
    dockerPull: haysb1991/oncorimage:0.2

inputs:
  move_script:
    type: string?
    default: |
      #!/bin/bash
      echo "$@"
      ls
      cp "$0" survmagic.txt
      ls
      Rscript --vanilla ../opt/srvkmplot.r survmagic.txt
      ls
      echo $?

    inputBinding:
      position: 1
    doc: |
      Bash function to generate needed plot for oncosplice web browser.

  data_input:
    type: File
    inputBinding:
      position: 2


outputs:
  stdout_log:
    type: stdout

  stderr_log:
    type: stderr

  outputplot:
    type: File
    outputBinding:
      glob: "survivalplot.png"    
  

baseCommand: [bash, '-c']

stdout: oncorsurvplot_stdout.log
stderr: oncorsurvplot_stderr.log

$namespaces:
  s: http://schema.org/

s:isPartOf:
  class: s:CreativeWork
  s:name: Common Workflow Language
  s:url: http://commonwl.org/

s:creator:
- class: s:Organization
  s:legalName: "Cincinnati Children's Hospital Medical Center"
  s:location:
  - class: s:PostalAddress
    s:addressCountry: "USA"
    s:addressLocality: "Cincinnati"
    s:addressRegion: "OH"
    s:postalCode: "45229"
    s:streetAddress: "3333 Burnet Ave"
    s:telephone: "+1(513)636-4200"
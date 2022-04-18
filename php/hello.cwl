cwlVersion: v1.0
class: CommandLineTool

hints:
  - class: DockerRequirement
    dockerPull: haysb1991/oncorimage:0.2

baseCommand: echo
inputs:
  message:
    type: string
    inputBinding:
      position: 1
outputs: []
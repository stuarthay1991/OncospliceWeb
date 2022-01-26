Make sure node is installed. In the target directory, use the following command to build the code.

`npm run-script build`

This project has a large list of dependencies that are pre-installed on the current server. Future versions will contain a full list of dependencies as well as a link to the node package. Currently the total size is roughly ~700 MB in total. Project should be installed as a sibling directory to that of the node modules.
<br>
KNOWN ISSUES
-Selecting a sample filter does not default to a selection. When a signature filter is selected and a sample filter has been added, but not selected, the screen whites out.
-Selecting LUAD signatures results in errors clustering, LUAD_Signatures table is faulted
-Full screen for heatmap view breaks after initial selection, defaults to very small size.
-Query History is not properly implemented on the server side.
-Selecting a blank selection sometimes results in a broken submission.
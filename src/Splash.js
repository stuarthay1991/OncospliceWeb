import useStyles from './css/useStyles.js';
import '@fontsource/roboto';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SpcInputLabel from './components/SpcInputLabel';

const boxProps = {
  border: 3,
};

function Splash() {
  return(
    <div id="main_splash_div">
      <br></br>
      <div id="updates_splash_div" style={{borderRadius: 15, borderStyle: "solid", border: 30, borderColor: "red", color: "red"}}>
        <span style={{borderRadius: 15, borderStyle: "solid", border: 30, borderColor: "red", color: "red", margin: 5}}>Check out our new Oncosplice updates!</span>
      </div>
      <br></br>
      <div id="content_splash_div">
      <Grid container spacing={3}>
          <Grid item xs={3}>
            <div id="welcome_splash_div">
            <Box borderColor="#dbdbdb" {...boxProps}>
              <div style={{background:"linear-gradient(to bottom, #4a8fa8 5%, #476e9e 100%)", backgroundColor: '#0F6A8B', color: "white"}}>
              <span style={{color: "white", margin: 8, marginLeft: 8, fontSize: 16}}>Welcome</span>
              </div>
              <div style={{fontSize: 10, margin: 8}}>
              <p>OncoSplice is an NIH supported research project (<a href="https://reporter.nih.gov/search/gxCJoumpGUCBdoMsV60Ycw/project-details/9495857">R01CA226802</a>) focused on defining and understanding novel splicing-defined patient subtypes across human cancers. The OncoSplice web-browser provides interactive access to diverse cancer datasets, enabling the selection of different patient subsets from existing clinical annotations (XenaBrowser) and splicing-events (known and novel). OncoSplice signatures are defined using the OncoSplice analysis workflow (<a href="https://github.com/venkatmi/oncosplice">https://github.com/venkatmi/oncosplice</a>) and in particular the software splice-ICGS. OncoSplice is a branch of the software AltAnalyze (<a href="http://altanalyze.org">http://altanalyze.org</a>).</p>
              <br></br>
              </div>
            </Box>
            </div>
            <div id="news_splash_div">
              <Box borderColor="#dbdbdb" {...boxProps}>
                <div style={{background:"linear-gradient(to bottom, #4a8fa8 5%, #476e9e 100%)", backgroundColor: '#0F6A8B', color: "white"}}>
                <span style={{color: "white", margin: 8, marginLeft: 8, fontSize: 16}}>News</span>
                </div>
                <div style={{margin: 8, fontSize: 10}}>
                <Grid container spacing={2}>
                <Grid item xs={8}>Awarded CpG funding to support Oncosplice Development</Grid>
                <Grid item xs={4}>05/09/2024</Grid>
                </Grid>
                </div>
                <div style={{margin: 8, fontSize: 10}}>
                <Grid container spacing={2}>
                <Grid item xs={8}>Cancer database updated</Grid>
                <Grid item xs={4}>05/01/2024</Grid>
                </Grid>
                </div>
              </Box>
            </div>
            <div id="summary_splash_div">
              <Box borderColor="#dbdbdb" {...boxProps}>
                <div style={{background:"linear-gradient(to bottom, #4a8fa8 5%, #476e9e 100%)", backgroundColor: '#0F6A8B', color: "white"}}>
                <span style={{color: "white", margin: 8, marginLeft: 8, fontSize: 16}}>Summary</span>
                </div>
                <div style={{margin: 8}}>
                  <table>
                    <tr>
                      <th>Metric</th>
                      <th>Amount</th>
                    </tr>
                    <tr>
                      <td>Cancers</td>
                      <td>20</td>
                    </tr>
                    <tr>
                      <td>Events</td>
                      <td>1000000</td>
                    </tr>
                    <tr>
                      <td>Patients</td>
                      <td>20000</td>
                    </tr>
                    <tr>
                      <td>Metadata Fields</td>
                      <td>2031</td>
                    </tr>
                    <tr>
                      <td>Splicing Signatures</td>
                      <td>3120</td>
                    </tr>
                  </table>
                </div>
              </Box>
            </div>
          </Grid>
          <Grid item xs={9}>
            <div id="search_splash_div">
              <Box borderColor="#dbdbdb" {...boxProps}>
                <div style={{background:"linear-gradient(to bottom, #4a8fa8 5%, #476e9e 100%)", backgroundColor: '#0F6A8B', color: "white"}}>
                <span style={{color: "white", margin: 8, marginLeft: 8, fontSize: 16}}>Search</span>
                </div>
                <div style={{margin: 8}}>
                Content
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                </div>
              </Box>
            </div>
          </Grid>
      </Grid>
      </div>
    </div>
  )
}

export default Splash;

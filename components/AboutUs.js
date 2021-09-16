import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

function AboutUs() {
	return(
    <div>
        <Box borderLeft={3} borderColor={'#0F6A8B'}>
        <div style={{marginLeft: 15, marginTop: 20, fontSize: 24}}>
        <strong><p style={{fontSize: 28}}>What is OncoSplice?</p></strong>
        <p>OncoSplice is an NIH supported research project (<a href="https://reporter.nih.gov/search/gxCJoumpGUCBdoMsV60Ycw/project-details/9495857">R01CA226802</a>) focused on defining and understanding novel splicing-defined patient subtypes across human cancers. The OncoSplice web-browser provides interactive access to diverse cancer datasets, enabling the selection of different patient subsets from existing clinical annotations (XenaBrowser) and splicing-events (known and novel). OncoSplice signatures are defined using the OncoSplice analysis workflow (<a href="https://github.com/venkatmi/oncosplice">https://github.com/venkatmi/oncosplice</a>) and in particular the software splice-ICGS. OncoSplice is a branch of the software AltAnalyze (<a href="http://altanalyze.org">http://altanalyze.org</a>).
</p>
        <p>The OncoSplice webportal is developed in ReactJS and PostgresSEQL and is currently in active development (alpha version). A manuscript describing OncoSplice and the OncoSplice webportal are currently in preparation. For questions, please contact the relevant OncoSplice team members.</p>
        <br />
        <Grid container spacing={5}>
            <Grid item xs={3}>
            <div><strong>Principle Investigator</strong></div>
            <div><strong>Lead Website Architect</strong></div>
            <div><strong>UI-UX Developer</strong></div>
            <div><strong>Co-Lead Data Scientist</strong></div>
            <div><strong>Co-Lead Data Scientist</strong></div>
            <div><strong>OncoSplice Development Lead</strong></div>
            </Grid>
            <Grid item xs={3}>
            <div>Nathan Salomonis</div>
            <div>Stuart Hay</div>
            <div>Adriana Navarro Sainz</div>
            <div>Anukana Bhattacharjee</div>
            <div>Audrey Crowther</div>
            <div>Meenakshi Venkatasubramanian</div>
            </Grid>
            <Grid item xs={3}>
            <div><a href="mailto: Nathan.Salomonis@cchmc.org">Nathan.Salomonis@cchmc.org</a></div>
            <div><a href="mailto: Stuart.Hay@cchmc.org">Stuart.Hay@cchmc.org</a></div>
            <div><a href="mailto: Adriana.NavarroSainz@cchmc.org">Adriana.NavarroSainz@cchmc.org</a></div>
            <div><a href="mailto: Anukana.Bhattacharjee@cchmc.org">Anukana.Bhattacharjee@cchmc.org</a></div>
            <div><a href="mailto: Audrey.Crowther@cchmc.org">Audrey.Crowther@cchmc.org</a></div>
            <div><a href="mailto: mixi03@gmail.com">mixi03@gmail.com</a></div>
            </Grid>
        </Grid>
        </div>
        </Box>
    </div>
    );
}

export default AboutUs;
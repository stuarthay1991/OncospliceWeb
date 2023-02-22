import { makeStyles, withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  }
});

const useStyles = makeStyles((theme) => ({
  overrides: {
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  },
  mainpane: {
    paddingTop: "5px",
    paddingBottom: "5px",
    flexGrow: 1,
    backgroundColor: 'white',
    color: '#0F6A8B',
  },
  mainpane_margin: {
    marginLeft: 50,
    marginRight: 100,
  },  
  myButton: {
  backgroundColor:'#EFAD18',
  borderRadius:'8px',
  display:'inline-block',
  cursor:'pointer',
  color:'#ffffff',
  fontFamily: 'Roboto',
  fontSize:'16px',
  fontWeight:'bold',
  padding:'13px 32px',
  textDecoration:'none',
  textShadow:'0px 1px 0px #3d768a',
  },
  viewpane: {
    flexGrow: 1,
    backgroundColor: 'white',
    border: 1,
  },
  flexparent: {
    display: "flex",
  },
  flexchild: {
    flex: 1,
  },  
  wid200: {
    width: "200px",
  },
  heatmap: {
    margin: 3,
  },
  cntr_generic: {
    fontSize: 20,
    textAlign: 'right',
  },
  cntr_viewpane: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'center',
  },
  filteritem_viewpane: {
    fontSize: 16,
    margin: 8,
    fontWeight: "bold",
    textAlign: 'left',
  },
  cntr_btn: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: 'center',
  },
  cntr_special: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: 'left',
  },
  hidden_panel: {
    display: "none",
  },
  root: {
    flexGrow: 1,
  },
  tabholder: {
    marginLeft: 100,
    marginRight: 100,
  },
  mpcontent: {
    marginLeft: 50,
    marginRight: 100,
  },
  smallpadding: {
    padding: theme.spacing(0.5),
  },
  padding: {
    padding: theme.spacing(2),
  },
  medpadding: {
    padding: theme.spacing(6),
  },
  heavypadding: {
    padding: theme.spacing(11),
  },
  fullempty: {
    padding: theme.spacing(40),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: '#edf0f5',
  },
  baseinput: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  basicbutton: {
    fontFamily: 'Roboto',
  },
  secondaryinput: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 275,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  iconSearch: {
    padding: 10,
    color: 'white',
    backgroundColor: '#0F6A8B',
  },
  divider: {
    height: 28,
    margin: 4,
  },
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formControl2: {
    minWidth: "360px",
    fontSize: "16px"
  },
}));

export default useStyles;
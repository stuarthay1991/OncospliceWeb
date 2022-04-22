console.log('process.argv', process.argv);

if(process.argv[2] == "local")
{
	const targeturl = "/material-app";
}
else
{
	const targeturl = "/ICGS/Oncosplice/testing";
}
/*var localurl = "/material-app";
var serverurl = "/ICGS/Oncosplice/testing";
var buildurl = "/ICGS/Oncosplice/build";
var hoturl = "/ICGS/Oncosplice/hotload";
const targeturl = serverurl;*/


export default targeturl;
import React from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import "./dropdown.css";

export function DropdownParent(props)
{
    const dId = props.title.concat("_id");
    const toggleDropdown = () => {
        //console.log(document.getElementById("div_".concat(dId)).classList);
        if(document.getElementById("exmoreicon_".concat(dId)).style.display == "none")
        {
            document.getElementById("div_".concat(dId)).classList.toggle("show");
            document.getElementById("exmoreicon_".concat(dId)).style.display = "block";
            document.getElementById("exlessicon_".concat(dId)).style.display = "none";
        }
    };
    return(
        <div id={"parent_".concat(dId)} class={"container"} onMouseLeave={toggleDropdown}>{props.children}</div>
    )
}

export function DropdownButton(props)
{
    const dId = props.title.concat("_id");
    const toggleDropdown = () => {
        document.getElementById("div_".concat(dId)).classList.toggle("show");
        if(document.getElementById("exmoreicon_".concat(dId)).style.display == "block")
        {
          document.getElementById("exlessicon_".concat(dId)).style.display = "block";
          document.getElementById("exmoreicon_".concat(dId)).style.display = "none";
        }
        else
        {
          document.getElementById("exlessicon_".concat(dId)).style.display = "none";
          document.getElementById("exmoreicon_".concat(dId)).style.display = "block";        
        }
        //toggleArrow.classList.toggle("arrow");
    };

    var btnAddOn = "";
    if(props.type == "side")
    {
        btnAddOn = "_side";
    }

    return(
    <button class={"btn".concat(btnAddOn)} id={dId} onClick={toggleDropdown}>
        {props.title}
        <span id={"exmoreicon_".concat(dId)} style={{display: "block"}}>
            {(() => {
                if(props.type == "vertical" || props.type == "multi")
                {
                    return <ExpandMoreIcon />;
                }
                else
                {
                    return <KeyboardArrowRightIcon />;
                }
            })()}
        </span>
        <span id={"exlessicon_".concat(dId)} style={{display: "none"}}>
            {(() => {
                if(props.type == "vertical" || props.type == "multi")
                {
                    return <ExpandLessIcon />;
                }
                else
                {
                    return <KeyboardArrowLeftIcon />;
                }
            })()}     
        </span>
    </button>
    );
}

export function DropdownList(props)
{
    const dId = props.title.concat("_id");
    return(
        <div class={"dropdown_".concat(props.type)} id={"div_".concat(dId)}>
            {props.children}
        </div>
    );
}

export function DropdownItem(props)
{
    return(
        <a value={props.value} onClick={props.handleClick}>
            {props.displayText}
        </a>        
    );
}
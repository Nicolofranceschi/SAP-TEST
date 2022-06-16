import React, { useState, useEffect } from "react";
import axios from "axios";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";
import "@ui5/webcomponents/dist/List"
import "@ui5/webcomponents/dist/Button.js"
import "@ui5/webcomponents/dist/StandardListItem";
import "@ui5/webcomponents-fiori/dist/FlexibleColumnLayout.js"
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import "@ui5/webcomponents/dist/DatePicker"
import "@ui5/webcomponents/dist/Select";
import "@ui5/webcomponents/dist/Option";
import "@ui5/webcomponents-fiori/dist/IllustratedMessage.js";
import "@ui5/webcomponents-fiori/dist/illustrations/UnableToUpload.js"
import "@ui5/webcomponents/dist/Title";
import "@ui5/webcomponents-fiori/dist/Timeline.js";
import "@ui5/webcomponents/dist/CustomListItem";
import "@ui5/webcomponents/dist/Card";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import image from "./images/logo.png";
import { getFormBody } from './utils';
import { useRef } from "react";
setTheme("sap_fiori_3");

function App() {
  const [layout, setLayout] = useState();

  const [date, setDate] = useState();
  const [fase, setFase] = useState();
  const [dettaglio, setDettaglio] = useState();

  const [list, setList] = useState([]);

  const datePicker = useRef();
  const faseRef = useRef();
  const dialogRef = useRef();

  const getList = async () => {
    try {
      const result = await axios.post("/list", { ...date, fase });
      if (!result) return console.error('errore');
      setList(result.data)
      console.log("🚀 ~ file: App.jsx ~ line 38 ~ getList ~ result.data", result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getDettaglio = async (key) => {
    setLayout("TwoColumnsMidExpanded")
    const result = await axios.post("/dettaglio", { key })
    if (!result) return console.error('errore')
    setDettaglio(result.data)
  }
  
  useEffect(() => {
    const handleDate = (e) => {
      console.log('change: ', e.detail);
      setDate(e.detail)
    }
    datePicker.current.addEventListener('change', handleDate);
    return () => datePicker.current.removeEventListener('change', handleDate)
  }, [])
  
  useEffect(() => {
    const handleFase = (e) => {
      setFase(e.detail.selectedOption.value)
    }
    faseRef.current.addEventListener('change', handleFase);
    return () => faseRef.current.removeEventListener('change', handleFase)
  }, []);

  return (
    <div >
      <ui5-flexible-column-layout id="fcl" layout={layout}>
        <div slot="startColumn">
          <ui5-shellbar primary-title="Dep. New York, USA">
            <div style={{ paddingTop: "1rem", paddingLeft: "1rem" }}>
              <img src={image} alt="logo" />
              <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <ui5-date-picker ref={datePicker} placeholder='Select Date'>
                  <div slot="valueStateMessage">The value is not valid. Please provide valid value</div>
                </ui5-date-picker>
                <ui5-select class="select" ref={faseRef} onInput={(e) => console.log(e, "ciao")}>
                  <ui5-option value="Phone">Phone</ui5-option>
                  <ui5-option value="Tablet">Tablet</ui5-option>
                  <ui5-option value="Desktop">Desktop</ui5-option>
                </ui5-select>
                <ui5-button onClick={getList}>GET</ui5-button>
                <ui5-button onClick={() => dialogRef.current.show()}>ADD</ui5-button>
              </div>
            </div>
          </ui5-shellbar>

          {list ? (
            <ui5-list id="col1list" header-text="Eleno dati produzione inseriti">
              {list.map((item, index) => (
                <ui5-li-custom key={index} no-data-text="No Data Available" icon="navigation-right-arrow" onClick={() => getDettaglio(item.SKEY)} icon-end >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "1rem" }}>
                    <ui5-title level="H2">{item.CLIENTE}</ui5-title>
                    <div>
                      <h3 style={{ fontWeight: "bold" }}>Modello {">"}</h3>
                      <p style={{ fontSize: "10px" }}>{item.MODELLO_FULL}</p>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: "bold" }}>Seq</h3>
                      <p style={{ fontSize: "10px" }}>{item.SEQUENZA}</p>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: "bold" }}>Codice lega</h3>
                      <p style={{ fontSize: "10px" }}>{item.CODICE_LEGA}</p>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: "bold" }}>Numero modelli</h3>
                      <p style={{ fontSize: "10px" }}>{item.NUMERO_FIGURE}</p>
                    </div>
                  </div>
                </ui5-li-custom>
              ))}
            </ui5-list>
          ) : (
            <ui5-illustrated-message name="EmptyList">
              No data
            </ui5-illustrated-message>
          )}
        </div>


        {dettaglio && (
          <div slot="midColumn">
            <div className="colHeader" style={{ paddingTop: "1rem", paddingLeft: "1rem" }}>
              <ui5-button design="Emphasized">Edit</ui5-button>
              <ui5-button design="Transparent" icon="add"></ui5-button>
              <ui5-button id="fullscreenMidColumn" design="Transparent" icon="full-screen"></ui5-button>
              <ui5-button id="closeMidColumn" icon="decline" design="Transparent" onClick={() => setLayout("oneColumn")}></ui5-button>
            </div>

            <ui5-card class="medium" style={{ padding: "1rem" }} >
              <h3 style={{ padding: "1rem" }}>Dettaglio produzione</h3>
            </ui5-card>
            <ui5-card class="medium" style={{ padding: "1rem" }}>
              <h3 style={{ padding: "1rem" }}>Fasi Produzione</h3>
              <ui5-timeline layout="Horizontal">
                <ui5-timeline-item title-text={dettaglio.lblFasePrecNome}>
                  <div>{dettaglio.lblFasePrecIE}</div>
                </ui5-timeline-item>
                <ui5-timeline-item title-text={dettaglio.lblFaseAttNome}>
                  <div>{dettaglio.lblFaseAttIE}</div>
                </ui5-timeline-item>
                <ui5-timeline-item title-text={dettaglio.lblFaseSuccNome}>
                  <div>{dettaglio.lblFaseSuccIE}</div>
                </ui5-timeline-item>
              </ui5-timeline>
            </ui5-card>

          </div>
        )}


        <div slot="endColumn">
          <div className="colHeader">
            <ui5-button design="Emphasized">Edit</ui5-button>
            <ui5-button design="Transparent" icon="add"></ui5-button>
            <ui5-button id="fullscreenEndColumn" design="Transparent" icon="full-screen"></ui5-button>
            <ui5-button id="closeEndColumn" icon="decline" design="Transparent"></ui5-button>
          </div>
          <ui5-illustrated-message name="UnableToUpload">
            <ui5-button design="Emphasized">Action 1</ui5-button>
            <ui5-button>Action 2</ui5-button>
          </ui5-illustrated-message>
        </div>
      </ui5-flexible-column-layout>

      <ui5-dialog id="hello-dialog" header-text="Register Form" ref={dialogRef}>
          <form onSubmit={e => console.log(getFormBody(e))} id="dialog-form">
            <section>
              <ui5-label for="username" required>Username: </ui5-label>
              <ui5-input name="username" id="username"></ui5-input>
            </section>

            <div slot="footer">
              <button type="submit">Register</button>
              {/* TODO: questo sotto non funziona, fa submit, ma e.preventDefault non viene chiamato */}
              {/* <ui5-button id="closeDialogButton" design="Emphasized" submits>Register</ui5-button> */}
            </div>
          </form>
      </ui5-dialog>

    </div>
  );
}

export default App;

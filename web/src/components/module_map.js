import React from "react"
// import { useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import "./popper.css";
import { ModuleCytoscapeGraph } from './curriculum_map';

cytoscape.use(popper);

const ModuleMap = () => {
  const elements = ModuleCytoscapeGraph()
  // const temp = {
  //   nodes: [
  //     {
  //       data: {
  //         id: '1',
  //         label: 'A.1',
  //         href: '/pedagogic_modules/single_core_computing/',
  //         text: 'data(id)',
  //         description: 'Some description'
  //       },
  //       position: {
  //         x: 543.5,
  //         y: 409
  //       },
  //     },
  //     {
  //       data: {
  //         id: '2',
  //         label: 'A.3.1',
  //         href: '/pedagogic_modules/networking_fundamentals/'
  //       },
  //       position: {
  //         x: 261.75,
  //         y: 838
  //       },
  //     },
  //     {
  //       data: {
  //         id: '3',
  //         label: 'A.2',
  //         href: '/pedagogic_modules/multi_core_computing/'
  //       },
  //       position: {
  //         x: 825.25,
  //         y: 838
  //       },
  //     },
  //     {
  //       data: {
  //         id: '4',
  //         label: 'A.3.2',
  //         href: '/pedagogic_modules/client_server/'
  //       },
  //       position: {
  //         x: 261.75,
  //         y: 1267
  //       },
  //     }, {
  //       data: {
  //         id: '5',
  //         label: 'A.3.3',
  //         href: '/pedagogic_modules/coordinator_worker/'
  //       },
  //       position: {
  //         x: 543.5,
  //         y: 1267
  //       },
  //     }, {
  //       data: {
  //         id: '6',
  //         label: 'A.3.4',
  //         href: '/pedagogic_modules/workflows/'
  //       },
  //       position: {
  //         x: 825.25,
  //         y: 1267
  //       },
  //     }, {
  //       data: {
  //         id: '7',
  //         label: 'C.1',
  //         href: '/pedagogic_modules/batch_scheduling/'
  //       },
  //       position: {
  //         x: 1107,
  //         y: 1267
  //       },
  //     },
  //     {
  //       data: {
  //         id: '8',
  //         label: 'B.1',
  //         href: '/pedagogic_modules/ci_service_concepts/'
  //       },
  //       position: {
  //         x: 261.75,
  //         y: 1696
  //       },
  //     },
  //     {
  //       data: {
  //         id: '9',
  //         label: 'C.2',
  //         href: '/pedagogic_modules/cloud_functions/'
  //       },
  //       position: {
  //         x: 543.5,
  //         y: 1696
  //       },
  //     },
  //     {
  //       data: {
  //         id: '10',
  //         label: 'D.1',
  //         href: '/pedagogic_modules/workflow_co2/'
  //       },
  //       position: {
  //         x: 1107,
  //         y: 1696
  //       },
  //     },
  //   ],
  //   edges: [
  //     {
  //       data: {
  //         source: '1',
  //         target: '2',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '1',
  //         target: '3',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '2',
  //         target: '4',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '2',
  //         target: '5',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '2',
  //         target: '6',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '3',
  //         target: '4',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '3',
  //         target: '5',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '3',
  //         target: '6',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '3',
  //         target: '7',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '4',
  //         target: '8',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '4',
  //         target: '9',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //     {
  //       data: {
  //         source: '5',
  //         target: '9',
  //         label: 'edge from node1 to node2',
  //       },
  //     },
  //   ],
  // };
  return (
    <>
    <h3 style={{
      marginBottom: `30px`,
      marginTop: `40px`,
      color: "#525252",
      textAlign: "center"
    }}>
      <br />Available eduWRENCH Modules
    </h3>
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements(elements)}
      maxZoom={10}
      minZoom={0.3}
      zoom={0.9}
      autolock={true}
      autoungrabify={true}
      autounselectify={true}
      boxSelectionEnabled={false}
      zoomingEnabled={false}
      panningEnabled={false}
      pan={{ x: 100, y: 0 }}
      cy={(cy) => {
        const containerStyle = cy.container().style;
        cy.on('tap', 'node', function () {
          try {
            window.open(this.data('href'));
          } catch (e) {
            window.location.href = this.data('href');
          }
        });
        cy.on('tapstart mouseover', 'node', function () {
          containerStyle['cursor'] = 'pointer'
        });
        cy.on('tapstart mouseout', 'node', function () {
          containerStyle['cursor'] = 'default'
        });
        cy.elements().unbind("mouseover");
        cy.elements().bind("mouseover", (event) => {
          if (event.target._private.data.description) {
            event.target.popperRefObj = event.target.popper({
              content: () => {
                let content = document.createElement("div");

                content.classList.add("popper-div");

                // content.innerHTML = event.target.id();
                // console.log("EVENT =");
                // console.log(event);
                // console.log("EVENT TARGET=");
                content.innerHTML = event.target[0]._private.data.description

                document.body.appendChild(content);
                return content;
              },
              renderedPosition: () => {
                return{
                  x: event.target[0]._private.position.x,
                  y: (event.target[0]._private.position.y === 800 && event.target[0]._private.position.x === 1000) ?
                    event.target[0]._private.position.y - 385 : event.target[0]._private.position.y - 230 -  event.target[0]._private.position.y / 10
                }},
            });
          }
        });
        cy.elements().unbind("mouseout");
        cy.elements().bind("mouseout", (event) => {
          if (event.target._private.data.description) {
            event.target.popperRefObj.state.elements.popper.remove();
            event.target.popperRefObj.destroy();
          }
        });
      }}
      stylesheet={[
        {
          selector: 'node',
          style: {
            'background-color': '#F5B971',
            'color': 'white',
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '220',
            "word-wrap": "break-word",
            'text-halign': 'center',
            'text-valign': 'center',
            'font-size': '18',
            'font-weight': '500',
            'width': '250',
            'height': '120',
            'shape': 'roundrectangle',
            "text-outline-color": "#d38000",
            "text-outline-width": "1px",
            'background-fit': 'cover',
            'border-color': '#8D1E00',
            'border-width': 1,
            'border-opacity': 0.5
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 5,
            'curve-style': 'unbundled-bezier',
            'line-color': '#00D380',
            'target-arrow-color': '#00D380',
            'target-arrow-shape': 'triangle',
          }
        },
      ]}

      style={{ width: '1172px', height: '800px' }}

    />
    </>
  );
};

export default ModuleMap;

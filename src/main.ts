import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Bird } from "./types";
import { birdForm, deleteBirdsButton, birdContainer, fetchBirdsButton } from "./variables";

//had to troubleshoot why my birds weren't loading
//turns out I just forgot to run the json server

let lastCreatedItem: null | Bird = null; //creating a variable to be used later

//FETCHING
fetchBirdsButton.addEventListener('click', async (event) => {
  event.preventDefault(); //stops it from constantly refreshing
  let response = await fetch("http://localhost:3000/birds") 
  let birdList: Bird[] = await response.json() 
        
  birdContainer.innerHTML = ''; 
        
  birdList.forEach(bird => { 
    const birdDiv = document.createElement('div'); 
    birdDiv.innerHTML = `<h3>${bird.name}</h3> 
    <p>${bird.latin_name}</p>`;
    birdContainer.appendChild(birdDiv);
  });
});
    

//ADDING
birdForm.addEventListener('submit', async (event) => {
  event.preventDefault(); 

  let nameInput = document.getElementById('bird-name') as HTMLInputElement;
  let latinInput = document.getElementById('latin-name') as HTMLInputElement;

  let name: string = nameInput ? nameInput.value : '';
  let latin: string = latinInput ? latinInput.value: '';

  const newBird = { //shows how to set up each bird object based on user submissions
    name: name,
    latin_name: latin
  };
    //function to create a new bird
  const response = await fetch('http://localhost:3000/birds', { //awaits to make sure it gets response from json
    method: "POST", //post method means create
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBird) //makes new bird into a string
  });

  const newlyCreatedItem = await response.json(); //sets a variable to the response
  lastCreatedItem = newlyCreatedItem; //sets our null variable above to be equal to newlyCreatedItem

  birdForm.reset(); //resets the form
});

//DELETING
if (deleteBirdsButton) { //function for deleting birds
  deleteBirdsButton.addEventListener('click', async (event)=> {
    event.preventDefault();
    if(!lastCreatedItem) { //if there is no lastCreatedItem, it won't delete anything
      console.log('No item created yet to delete');
      return;
    }
    const response = await fetch (`http://localhost:3000/birds/${lastCreatedItem.id}`, { //if there is a last created item, deletes that
      method: "DELETE"
    });

    if (response.ok) {
      console.log(`Bird with ID ${lastCreatedItem.id} deleted successfully.`);
      lastCreatedItem = null;
    } else {
      console.error("Failed to delete bird:", response.statusText);
    }
  });
}






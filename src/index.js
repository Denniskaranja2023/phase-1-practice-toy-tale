let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});



document.addEventListener('DOMContentLoaded', () => {
  // Fetch toys from local server
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        createToyCard(toy);
      });
    });
});

function createToyCard(toy) {
  // Create outer card div
  const card = document.createElement('div');
  card.className = 'card';

  // Create h2 element with toy name
  const name = document.createElement('h2');
  name.textContent = toy.name;

  // Create img element with toy image
  const image = document.createElement('img');
  image.src = toy.image;
  image.className = 'toy-avatar';

  // Create p element with toy likes
  const likes = document.createElement('p');
  likes.textContent = `${toy.likes} Likes`;

  // Create button element for liking
  const likeButton = document.createElement('button');
  likeButton.className = 'like-btn';
  likeButton.id = toy.id;
  likeButton.textContent = 'Like ❤️';

   likeButton.addEventListener('click', () => {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // update local copy
      likes.textContent = `${updatedToy.likes} Likes`; // update DOM
    })
    .catch(error => console.error("Error updating likes:", error));
  });

  // Append all elements to card
  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);
  card.appendChild(likeButton);

  // Append card to the toy collection
  document.getElementById('toy-collection').appendChild(card);
}

const newToyForm = document.querySelector('.add-toy-form')
newToyForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
       name: e.target.name.value,
       image: e.target.image.value,
       likes:0}
    )
  }).then(res=>res.json()).then(data=>{ createToyCard(data)
  newToyForm.reset();}).catch(error=> console.error("error adding new toy:", error))
})
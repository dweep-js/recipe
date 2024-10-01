// Add an event listener to the search button to fetch meal details when clicked
document.getElementById("accept").addEventListener("click", fetchMealDetails);

// Async function to fetch meal details based on user input
async function fetchMealDetails() {
  // Get the meal name from the input field and trim any whitespace
  const mealName = document.querySelector("input").value.trim();

  // Alert the user if no meal name was entered
  if (!mealName) {
    alert("Please enter a meal name.");
    return;
  }

  try {
    // Fetch data from TheMealDB API using the meal name
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
    );
    const data = await response.json();

    // Select the card element to display the meal details
    const card = document.querySelector(".card");
    card.innerHTML = ""; // Clear any previous content in the card

    // Check if any meals were found
    if (data.meals) {
      const mealDetails = data.meals[0]; // Get the first meal's details

      // Create an image element for the meal
      const image = document.createElement("img");
      image.src = mealDetails.strMealThumb; // Set the image source
      image.alt = mealDetails.strMeal; // Set the alt text

      // Create a title element for the meal
      const title = document.createElement("h2");
      title.innerText = mealDetails.strMeal; // Set the meal title

      // Create a container for the image and overlay
      const contentContainer = document.createElement("div");
      contentContainer.style.position = "relative"; // Set relative positioning for the overlay
      contentContainer.appendChild(image); // Append the meal image

      // Create an overlay for the meal title
      const titleOverlay = document.createElement("div");
      titleOverlay.innerText = mealDetails.strMeal; // Set overlay text
      titleOverlay.style.position = "absolute"; // Position absolutely
      titleOverlay.style.top = "10px"; // Position at the top
      titleOverlay.style.left = "10px"; // Position to the left
      titleOverlay.style.color = "white"; // Text color
      titleOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
      titleOverlay.style.padding = "5px"; // Padding for aesthetics
      titleOverlay.style.borderRadius = "5px"; // Rounded corners

      contentContainer.appendChild(titleOverlay); // Append the overlay to the container

      // Prepare ingredients and instructions
      const ingredients = [];
      const instructions = mealDetails.strInstructions
        .split(".") // Split instructions into an array by period
        .filter(Boolean) // Remove empty elements
        .map((step) => step.trim()); // Trim whitespace

      // Create ingredients list with emojis
      for (let i = 1; i <= 20; i++) {
        const ingredient = mealDetails[`strIngredient${i}`];
        const measure = mealDetails[`strMeasure${i}`];
        if (ingredient) {
          ingredients.push(`🥘 ${measure} ${ingredient}`); // Add ingredient with emoji
        }
      }

      let currentState = 0; // Track the current state for toggling ingredients and instructions
      let currentInstructionIndex = 0; // Track the current instruction index

      // Click event for content container to toggle between ingredients and instructions
      contentContainer.onclick = () => {
        currentState++; // Increment the state on each click
        if (currentState === 1) {
          // Show ingredients
          const ingredientsBar = document.createElement("div");
          ingredientsBar.className = "ingredients-bar";
          const ingredientsList = document.createElement("ul");
          ingredients.forEach((ing) => {
            const li = document.createElement("li");
            li.innerText = ing; // Add each ingredient to the list
            ingredientsList.appendChild(li);
          });
          ingredientsBar.appendChild(ingredientsList);
          contentContainer.appendChild(ingredientsBar); // Append ingredients to the container
        } else if (currentState === 2) {
          // Hide ingredients and show instructions
          const ingredientsBar =
            contentContainer.querySelector(".ingredients-bar");
          if (ingredientsBar) {
            ingredientsBar.remove(); // Remove ingredients bar
          }

          displayInstructions(
            contentContainer,
            instructions,
            currentInstructionIndex, // Display next set of instructions
          );
          currentInstructionIndex += 4; // Increment the instruction index
        } else {
          // Display the next set of instructions
          if (currentInstructionIndex < instructions.length) {
            displayInstructions(
              contentContainer,
              instructions,
              currentInstructionIndex,
            );
            currentInstructionIndex += 4; // Increment the instruction index
          }

          // Reset state if all instructions have been displayed
          if (currentInstructionIndex >= instructions.length) {
            currentState = 0; // Reset state
            currentInstructionIndex = 0; // Reset instruction index
            const instructionsContainer =
              contentContainer.querySelector(".instructions");
            if (instructionsContainer) {
              instructionsContainer.innerHTML = ""; // Clear the instructions container
            }
          }
        }
      };

      // Append the content container to the card and make it visible
      card.appendChild(contentContainer);
      card.style.display = "block";
    } else {
      // If no meals are found, display an alert and clear the card
      card.innerHTML = "";
      card.style.display = "none";
      alert("No meals found. Please try another meal name.");
    }
  } catch (error) {
    // Handle errors during the fetch process
    console.error("Error fetching meal details:", error);
    alert("Error loading recipe. Please try again later.");
    const card = document.querySelector(".card");
    card.innerHTML = ""; // Clear the card on error
    card.style.display = "none"; // Hide the card
  }
}

// Function to display instructions
function displayInstructions(container, instructions, startIndex) {
  let instructionsContainer = container.querySelector(".instructions");
  if (!instructionsContainer) {
    // Create instructions container if it doesn't exist
    instructionsContainer = document.createElement("div");
    instructionsContainer.className = "instructions";
    instructionsContainer.innerHTML = "<h3>Instructions:</h3>"; // Add heading
    container.appendChild(instructionsContainer); // Append to container
  } else {
    // Clear existing instructions and add heading
    instructionsContainer.innerHTML = "<h3>Instructions:</h3>";
  }

  // Loop through instructions and display the next set
  for (let i = startIndex; i < startIndex + 4 && i < instructions.length; i++) {
    const stepDiv = document.createElement("p");
    stepDiv.innerText = `🍽️ ${instructions[i]}`; // Add emoji to instructions
    instructionsContainer.appendChild(stepDiv); // Append step to instructions container
  }
}

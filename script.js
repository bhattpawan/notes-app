// // Storage Controller
// const StorageController = (function () {
//   return {
//     addItemToStorage: function (newItem) {
//       let items;
//       // Check if any items are there
//       if (localStorage.getItem("items") === null) {
//         items = [];
//       } else {
//         // Get items from storage
//         items = JSON.parse(localStorage.getItem("items"));
//       }
//       // Push new item
//       items.push(newItem);
//       // Update localStorage
//       localStorage.setItem("items", JSON.stringify(items));
//     },
//     getItemsFromStorage: function () {
//       let items;
//       // Check if any items are there
//       if (localStorage.getItem("items") === null) {
//         items = [];
//       } else {
//         // Get items from storage
//         items = JSON.parse(localStorage.getItem("items"));
//       }
//       return items;
//     },
//   };
// })();

// Item Controller
const ItemController = (function () {
  const Item = function (id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  };

  const data = {
    // items: StorageController.getItemsFromStorage(),
    items: [
      { id: 1, title: "Untitled", content: "Content for note is here" },
      { id: 2, title: "Titled", content: "Lorem ipsum dolor set amit" },
    ],
    currentItem: null,
  };

  return {
    addItem: function (newItem) {
      let id = 1;
      if (data.items.length > 0) {
        id = data.items.length + 1;
      }
      if (newItem.title == "") {
        newItem.title = "Untitled";
      }
      const item = new Item(id, newItem.title, newItem.content);

      data.items.push(item);
      return item;
    },
    getItems: function () {
      return data.items;
    },
    setCurrentItem: function (e) {
      const current = e.target.parentElement.parentElement.parentElement.parentElement;
      data.items.forEach((item) => {
        if (item.id == current.id) {
          data.currentItem = item;
        }
      });
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getCurrentItemId: function () {
      if (data.currentItem != null) {
        return data.currentItem.id;
      }
    },
    removeCurrentItem: function () {
      data.currentItem = null;
    },
    editItem: function (inputData) {
      data.items.forEach((item) => {
        if (item.id == data.currentItem.id) {
          console.log(inputData);
          item.title = inputData.title;
          item.content = inputData.content;
        }
      });
    },
    deleteItem: function () {
      data.items.forEach((item, index) => {
        if (item.id == data.currentItem.id) {
          data.items.splice(index, 1);
        }
      });
    },
  };
})();

// UIController
const UIController = (function () {
  const UISelectors = {
    navSearch: "#nav-search",
    notesGrid: ".notes-grid",
    noteCard: ".note-card",
    addNoteBtn: ".add-note-btn",
    updateNoteBtn: ".update-note-btn",
    backBtn: ".back-btn",
    addTitle: "#add-note-title",
    addContent: "#add-note-content",
    done: ".done",
    undone: ".undone",
    edit: ".edit",
    delete: ".delete",
    noteTitle: ".note-title",
    noteContent: ".note-content",
    actionButtons: ".card-action-buttons",
  };
  return {
    populateUI: function (items) {
      let html = "";
      items.forEach((item) => {
        if (item != null) {
          html += `
          <div class="note-card box-shadow" id="${item.id}">
              <div class="note-content-box">
                  <p class="note-title">${item.title}</p>
                  <p class="note-content">${item.content}</p>
                  <ul class="card-action-buttons">
                      <li><i class="done fas fa-check"></i></li>
                      <li><i class="undone hidden fas fa-undo"></i></li>
                      <li><i class="edit fas fa-edit"></i></li>
                      <li><i class="delete fas fa-trash-alt"></i></li>
                  </ul>
              </div>
          </div>
            `;
        }
      });

      document.querySelector(UISelectors.notesGrid).innerHTML += html;
    },
    getFormData: function () {
      const title = document.querySelector(UISelectors.addTitle).value;
      const content = document.querySelector(UISelectors.addContent).value;
      return {
        title: title,
        content: content,
      };
    },
    addNoteToUI: function (inputData) {
      html = `
        <div class="note-card box-shadow" id="${inputData.id}">
            <div class="note-content-box">
                <p class="note-title">${inputData.title}</p>
                <p class="note-content">${inputData.content}</p>
                <ul class="card-action-buttons">
                    <li><i class="done fas fa-check-circle"></i></li>
                    <li><i class="undone hidden fas fa-undo"></i></li>
                    <li><i class="edit fas fa-edit"></i></li>
                    <li><i class="delete fas fa-trash-alt"></i></li>
                </ul>
            </div>
        </div>
      `;
      document.querySelector(UISelectors.notesGrid).innerHTML += html;
    },
    markAsDone: function (currentItemId) {
      const noteCards = document.querySelectorAll(UISelectors.noteCard);
      noteCards.forEach((card) => {
        if (card.id == currentItemId) {
          card.classList.add("mark-as-done");
          card.querySelector(UISelectors.done).classList.add("hidden");
          card.querySelector(UISelectors.edit).classList.add("hidden");
          card.querySelector(UISelectors.undone).classList.remove("hidden");
        }
      });
    },
    markAsUndone: function (currentItemId) {
      const noteCards = document.querySelectorAll(UISelectors.noteCard);
      noteCards.forEach((card) => {
        if (card.id == currentItemId) {
          card.classList.remove("mark-as-done");
          card.querySelector(UISelectors.done).classList.remove("hidden");
          card.querySelector(UISelectors.edit).classList.remove("hidden");
          card.querySelector(UISelectors.undone).classList.add("hidden");
        }
      });
    },
    deleteNoteFromUI: function (currentItemId) {
      document.getElementById(currentItemId).classList.add("hidden");
    },
    editNoteInUI: function (currentItemId, currentItem) {
      document.querySelectorAll(UISelectors.noteCard).forEach((card) => {
        if (card.id == currentItemId) {
          // Populate input fields
          document.querySelector(UISelectors.addTitle).value = currentItem.title;
          document.querySelector(UISelectors.addContent).value = currentItem.content;
          // Show/Hide
          document.getElementById(currentItemId).classList.add("current-item");
          document.querySelector(UISelectors.addNoteBtn).classList.add("hidden");
          document.querySelector(UISelectors.updateNoteBtn).classList.remove("hidden");
          document.querySelector(UISelectors.backBtn).classList.remove("hidden");
          card.querySelector(UISelectors.actionButtons).classList.add("hidden");
        }
      });
    },
    resetCurrentElementInUI: function (currentItemId) {
      document.querySelectorAll(UISelectors.noteCard).forEach((card) => {
        console.log(currentItemId);
        if (card.id == currentItemId) {
          console.log(card.id, currentItemId);
          // Populate input fields
          document.querySelector(UISelectors.addTitle).value = "";
          document.querySelector(UISelectors.addContent).value = "";
          // Show/Hide
          document.getElementById(currentItemId).classList.remove("current-item");
          document.querySelector(UISelectors.addNoteBtn).classList.remove("hidden");
          document.querySelector(UISelectors.updateNoteBtn).classList.add("hidden");
          document.querySelector(UISelectors.backBtn).classList.add("hidden");
          card.querySelector(UISelectors.actionButtons).classList.remove("hidden");
        }
      });
    },
    updateNoteInUI: function (currentItemId, currentItem, inputData) {
      document.querySelectorAll(UISelectors.noteCard).forEach((card) => {
        if (card.id == currentItemId) {
          card.querySelector(UISelectors.noteTitle).textContent = inputData.title;
          card.querySelector(UISelectors.noteContent).textContent = inputData.content;
        }
      });
      this.resetCurrentElementInUI(currentItemId);
    },
    clearInputFields: function () {
      document.querySelector(UISelectors.addTitle).value = "";
      document.querySelector(UISelectors.addContent).value = "";
      document.querySelector(UISelectors.navSearch).value = "";
    },
    getUISelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const AppController = (function (ItemController, UIController) {
  // Get UI Selectors
  UISelectors = UIController.getUISelectors();

  // Add a New Note
  document.querySelector(UISelectors.addNoteBtn).addEventListener("click", addNewNote);

  // Mark Note as done
  document.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("done")) {
      markAsDone(e);
    } else if (e.target.classList.contains("undone")) {
      markAsUndone(e);
    } else if (e.target.classList.contains("delete")) {
      deleteNote(e);
    } else if (e.target.classList.contains("edit")) {
      editNote(e);
    } else if (e.target.classList.contains("back-btn")) {
      backButton(e);
    } else if (e.target.classList.contains("update-note-btn")) {
      updateNote(e);
    }
  });

  function addNewNote(e) {
    e.preventDefault();
    // Get input data
    const inputData = UIController.getFormData();
    if (inputData.content != "" || inputData.title != "") {
      // Add new item to itemlist
      const newItem = ItemController.addItem(inputData);
      // Add Note to UI
      UIController.addNoteToUI(newItem);
      // Clear Input Fields
      UIController.clearInputFields();
    }
  }

  function markAsDone(e) {
    e.preventDefault();
    // Set current item
    ItemController.setCurrentItem(e);
    // Get current item Id
    const currentItemId = ItemController.getCurrentItemId();
    // Make UI Changes
    UIController.markAsDone(currentItemId);
    // Reset current Item
    ItemController.removeCurrentItem();
  }

  function markAsUndone(e) {
    e.preventDefault();
    // Set current item
    ItemController.setCurrentItem(e);
    // Get current item Id
    const currentItemId = ItemController.getCurrentItemId();
    // Make UI Changes
    UIController.markAsUndone(currentItemId);
    // Reset current Item
    ItemController.removeCurrentItem();
  }

  function deleteNote(e) {
    e.preventDefault();
    // Set current item
    ItemController.setCurrentItem(e);
    // Get current item Id
    const currentItemId = ItemController.getCurrentItemId();
    // Make UI Changes
    UIController.deleteNoteFromUI(currentItemId);
    // Delete from items
    ItemController.deleteItem();
    // Reset current Item
    ItemController.removeCurrentItem();
  }

  function editNote(e) {
    e.preventDefault();
    // Check for any active item
    if (ItemController.getCurrentItem() !== null) {
      UIController.resetCurrentElementInUI(ItemController.getCurrentItemId());
      ItemController.removeCurrentItem();
    }
    // Set current item
    ItemController.setCurrentItem(e);
    // Get current item Id
    const currentItemId = ItemController.getCurrentItemId();
    const currentItem = ItemController.getCurrentItem();
    // Make UI Changes
    UIController.editNoteInUI(currentItemId, currentItem);
  }

  function backButton(e) {
    e.preventDefault();
    // Get current item Id
    const currentItemId = ItemController.getCurrentItemId();
    // Make UI Changes
    UIController.resetCurrentElementInUI(currentItemId);
    // Reset current Item
    ItemController.removeCurrentItem();
  }

  function updateNote(e) {
    e.preventDefault();
    // Get current item Id
    const currentItemId = ItemController.getCurrentItemId();
    const currentItem = ItemController.getCurrentItem();
    // Get Updated Data From Input Fields
    const inputData = UIController.getFormData();
    if (inputData.content != "" && inputData.title != "") {
      // Update Item in DOM
      UIController.updateNoteInUI(currentItemId, currentItem, inputData);
      // Update item in itemlist
      ItemController.editItem(inputData);
      // Reset current Item
      ItemController.removeCurrentItem();
      // Clear Input Fields
      UIController.clearInputFields();
    }
  }

  return {
    init: function () {
      // Get items
      const items = ItemController.getItems();
      //   Populate UI
      UIController.populateUI(items);
      //   Clear Input Fields
      UIController.clearInputFields();
    },
  };
})(ItemController, UIController);
AppController.init();

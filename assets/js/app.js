var app = new Vue({
  el: "#app",
  data: {
    msg: "hello from vue and php app",
    error: false,
    errorMsg: "",
    successMsg: "",
    showAddModal: false,
    showEditModal: false,
    showDeconsteModal: false,
    formErrors: {},
    users: [],
    newUser: {
      name: "",
      email: "",
      phone: ""
    },
    currentUser: {}
  },
  mounted: function() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      axios
        .get("http://localhost/vue-php/config.php?action=read")
        .then(response => {
          if (response.data.error) {
            app.errorMsg = response.data.message;
          } else {
            this.users = response.data.users;
          }
        });
    },

    addUser() {
      var formData = this.toFormData(this.newUser);
      axios
        .post("http://localhost/vue-php/config.php?action=create", formData)
        .then(response => {
          this.newUser = {
            name: "",
            email: "",
            phone: ""
          };
          if (response.data.error) {
            this.error = true;
            this.errorMsg = response.data.message;
            this.formErrors = response.data.errors;
            this.errorAdded(this.formErrors);
          } else {
            this.successMsg = response.data.message;
            this.getUsers();
            this.successAdded("Profile Added Succesfully");
          }
        });
    },
    updateUser() {
      var formData = this.toFormData(this.currentUser);
      axios
        .post("http://localhost/vue-php/config.php?action=update", formData)
        .then(response => {
          this.currentUser = {};
          if (response.data.error) {
            this.error = true;
            this.errorMsg = response.data.message;
            this.formErrors = response.data.errors;
            this.errorAdded(this.formErrors);
            this.getUsers();
          } else {
            this.successMsg = response.data.message;
            this.getUsers();
            this.successAdded("Profile Updated Succesfully");
          }
        });
    },
    toFormData(obj) {
      var fd = new FormData();
      for (var i in obj) {
        fd.append(i, obj[i]);
      }
      return fd;
    },
    selectUser(user) {
      this.currentUser = user;
    },
    deleteUser() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn green",
          cancelButton: "btn red mr-1"
        },
        buttonsStyling: false
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true
        })
        .then(result => {
          if (result.value) {
            this.deleteSelectedUser();
            swalWithBootstrapButtons.fire(
              "Deleted!",
              "Your User has been deleted.",
              "success"
            );
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Your imaginary file is safe :)",
              "error"
            );
          }
        });
    },
    deleteSelectedUser() {
      var formData = this.toFormData(this.currentUser);
      axios
        .post("http://localhost/vue-php/config.php?action=delete", formData)
        .then(response => {
          this.currentUser = {};
          if (response.data.error) {
            this.error = true;
            this.errorMsg = response.data.message;
          } else {
            this.successMsg = response.data.message;
            this.getUsers();
          }
        });
    },
    successAdded(msg) {
      Toast.fire({
        type: "success",
        title: msg
      });
    },
    errorAdded(errors) {
      let text = "";
      errors.forEach(ele => {
        text += ele + "<br>";
      });

      Toast.fire({
        type: "error",
        title: "Oops...",
        html: text
      });
    }
  }
});

// activate modal
document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".modal");
  const instances = M.Modal.init(elems);
  instances.open();
  instances.close();
});

// activate tooltip

document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".tooltipped");
  const instances = M.Tooltip.init(elems);
  instances.open();
  instances.close();
});

const Toast = Swal.mixin({
  position: "center",
  timer: 3000
});

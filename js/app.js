/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function() {
    'use strict';
    var destination = document.querySelector("#container");
    var placeholder = document.createElement("li");
    placeholder.className = "placeholder";

    app.ALL_TODOS = 'all';
    app.ACTIVE_TODOS = 'active';
    app.COMPLETED_TODOS = 'completed';
    var TodoFooter = app.TodoFooter;
    var fromState;
    var toState= 'inprogress';;


    var TodoList = React.createClass({

        getInitialState: function() {

            return {
                todo: [],
                inProgress: [],
                done: []
            };
        },

        addItem: function(e) {
            var itemArray = this.state.todo;

            itemArray.push({
                text: this._inputElement.value,
                key: Date.now()
            });

            this.setState({
                todo: itemArray
            });

            this._inputElement.value = "";
            this.updateCounts();

            e.preventDefault();
        },
        addInProgressItem: function(fromObj) {
            var itemArray = this.state.inProgress;

            // var fromObj = {text: 'kbc',
            //   key:Date.now()}

            itemArray.push(fromObj);

            this.setState({
                inProgress: itemArray
            });

            this.updateCounts();
            //document.getElementById("totalCount").innerHTML = itemArray.length;

            //e.preventDefault();
        },
        render: function() {

          return (
            <div className="todoListMain">
              <div className="header">
                <form onSubmit={this.addItem} className="projectForm">
                  <label>add project   </label>
                    <input ref={(a) => this._inputElement = a}
                       placeholder="enter prject">
                    </input>
                </form>
                <div id="totalCountBox" className="counterBox">
                  <div>Total</div>
                  <div><div id="totalCount" className='countText'>0</div><div>Projects</div></div>
                </div>
              </div>
              <div>
                  <div className="columns left column1">
                    <div className="taskColumns todo">
                      To Do
                      <div className="counterBox"><div id="todoCount" className='countText'>0</div><div>Projects</div></div>
                    </div>
                    <ul className="todo-column theList"  onDragOver={this.dragOver}>
                      {this.state.todo.map(function(item) {
                        return (
                          <li
                            data-id={item.key}
                            key={item.key}
                            draggable="true"
                            onDragEnd={this.dragEnd}
                            onDragStart={this.dragStart}
                          >
                            {item.text}
                          </li>
                        )
                      }, this)}
                    </ul>
                  </div>
                  <div className="columns left column2">
                    <div className="taskColumns inProgress">
                      In Progress
                      <div className="counterBox"><div id="inProgressCount" className='countText'>0</div><div>Projects</div></div>
                    </div>
                    <ul className="inprogress-column theList" onDragOver={this.inProgressdragOver}>
                      {this.state.inProgress.map(function(item) {
                        return (
                          <li
                            data-id={item.key}
                            key={item.key}
                            draggable="true"
                            onDragEnd={this.dragEndInProgress}
                            onDragStart={this.dragStart}
                          >
                            {item.text}
                          </li>
                        )
                      }, this)}
                    </ul>
                  </div>
                  <div className="columns left column3">
                    <div className="taskColumns done">
                      Done
                      <div className="counterBox"><div id="doneCount" className='countText'>0</div><div>Projects</div></div>
                    </div>
                    <ul className="done-column theList"  >
                      {this.state.done.map(function(item) {
                        return (
                          <li
                            data-id={item.key}
                            key={item.key}
                            draggable="true"
                            onDragEnd={this.dragEnd}
                            onDragStart={this.dragStart}
                          >
                            {item.text}
                          </li>
                        )
                      }, this)}
                    </ul>
                  </div>
              </div>


            </div>
          );
        },
        dragStart: function(e) {
          console.log("dragStart");
            this.dragged = e.currentTarget;
            e.dataTransfer.effectAllowed = 'move';

            // Firefox requires calling dataTransfer.setData
            // for the drag to properly work
            e.dataTransfer.setData("text/html", e.currentTarget);
        },
        dragEnd: function(e) {
          console.log("dragEnd");
            this.draggedTo = e.currentTarget;
            this.dragged.style.display = "block";

            //console.log(e.target.parentNode);
            this.dragged.parentNode.removeChild(placeholder);
//console.log(this.draggedTo);
            // Update state
            var itemArray = this.state.todo;
            var fromKey = this.dragged.dataset.id;
            var toKey = this.over.dataset.id;
            var from, to;
            var fromObj;

            for (var i in itemArray) {
                if (itemArray[i].key == fromKey) {
                    from = i;
                    fromObj = itemArray[i];
                }

                if (itemArray[i].key == toKey) {
                    to = i;
                }
            }

            console.log("from :" + from);
            console.log("to :" + to);
console.log('tosatte: ' + toState)
            //Move to Inprogress
            if(toState == 'inprogress') {
                itemArray.splice(from,1);
                var inProgressArray = this.state.inProgress;
                this.addInProgressItem(fromObj);
                this.setState({ inProgress: inProgressArray });
             } else {
                if (from < to) to--;
                itemArray.splice(to, 0, itemArray.splice(from, 1)[0]);
                this.setState({ todo: itemArray });
             }



        },
        inProgressdragOver: function(e){
          console.log("inProgressdragOver");
          e.preventDefault();
          this.dragged.style.display = "none";
          if(e.target.className == "placeholder") return;
          this.over = e.target;
          // Inside the dragOver method
          var relY = e.clientY - this.over.offsetTop;
          var height = this.over.offsetHeight / 2;
          var parent = e.target.parentNode;

          if(relY > height) {
            this.nodePlacement = "after";
            parent.insertBefore(placeholder, e.target.nextElementSibling);
          }
          else if(relY < height) {
            this.nodePlacement = "before"
            parent.insertBefore(placeholder, e.target);
          }

        },
        dragEndInProgress: function(e) {
          toState = 'inprogress';
          console.log("dragEndInProgress");
          console.log(e.currentTarget);
            this.draggedTo = e.currentTarget;
            this.dragged.style.display = "block";
            console.log(e.target.parentNode);
            this.dragged.parentNode.removeChild(placeholder);

          }
        ,
        dragOver: function(e) {
          //console.log(e.target.parentNode.parentNode);
          //console.log(e.currentTarget)
            //e.preventDefault();
            //this.dragged.style.display = "none";
            //if (e.target.className == "placeholder") return;
            //this.over = e.target;
            //e.target.parentNode.insertBefore(placeholder, e.target);

            //new
          e.preventDefault();
          this.dragged.style.display = "none";
          if(e.target.className == "placeholder") return;
          this.over = e.target;
          // Inside the dragOver method
          var relY = e.clientY - this.over.offsetTop;
          var height = this.over.offsetHeight / 2;
          var parent = e.target.parentNode;

          if(relY > height) {
            this.nodePlacement = "after";
            parent.insertBefore(placeholder, e.target.nextElementSibling);
          }
          else if(relY < height) {
            this.nodePlacement = "before"
            parent.insertBefore(placeholder, e.target);
          }
        },
        updateCounts: function() {
          document.getElementById("totalCount").innerHTML = this.state.todo.length+this.state.inProgress.length+this.state.done.length;
          document.getElementById("todoCount").innerHTML = this.state.todo.length;
          document.getElementById("inProgressCount").innerHTML = this.state.inProgress.length;
          document.getElementById("doneCount").innerHTML = this.state.done.length;

        }
    });


    /*Render in Dom */

    ReactDOM.render( < div >
        < TodoList / >
        < /div>,
        destination
    );

})();

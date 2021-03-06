import React, { FormEvent } from "react";
import "./TodoHub.scss";
import {
  Segment,
  Header,
  Form,
  Input,
  List,
  Checkbox,
  CheckboxProps,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { currentTime, todaysDateAlt } from "./Helpers/utilities";

interface IHubProps {}
interface IHubState {
  localItems: string[];
  item: string;
  items: any[];
  editItem: boolean;
}

class TodoHub extends React.Component<IHubProps, IHubState> {
  constructor(props: IHubState) {
    super(props);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.editItem = this.editItem.bind(this);

    this.state = {
      localItems: [],
      items: [],
      item: "",
      editItem: false,
    };
  }

  public async componentDidMount() {
    const local = localStorage.getItem("local");
    const localItems: string[] = local ? local.split(",") : [];
    const itemsData: any[] = this.getItems(localItems);
    this.setState({
      items: [...this.state.items, ...itemsData],
      localItems: localItems,
    });
  }

  public render(): JSX.Element {
    return (
      <div className="main">
        <Segment className="mt-5 main-segment">
          <Header className="flex-col">
            <span>Today</span>
            <span>{todaysDateAlt()}</span>
            <span>{currentTime()}</span>
          </Header>
          <Form className="flex-row form-input" onSubmit={this.addItem}>
            <Input
              id="addTodo"
              className="todo-input"
              name="addTodo"
              placeholder="add todo item"
              onChange={this.handleItemChange}
            />
            <Form.Button content="Add" name="add-item" primary />
          </Form>
          <List className="todo-items">{this.renderItems()}</List>
        </Segment>
      </div>
    );
  }

  private renderItems(): JSX.Element[] {
    let count = 0;
    return this.state.items.map((item) => {
      count++;
      const strike = item.checked ? "strike" : "";
      return (
        <Segment key={count} vertical className={`item-segment ${strike}`}>
          <Checkbox
            name={item.value}
            checked={item.checked}
            onChange={this.handleCheckboxChange}
          />
          <List.Icon name="github" size="large" verticalAlign="middle" />
          <List.Content onClick={this.editItem} name={item.value}>
            <span id={item.value}>{item.value}</span>
          </List.Content>
          <div className="item-right">
            <div className="item-options">
              <span> {item.date}</span>
              <List.Icon
                className="edit-item"
                name="edit"
                onClick={this.editItem}
                size="large"
                verticalAlign="middle"
              />
              <List.Icon
                className="x-item"
                name="x"
                size="large"
                verticalAlign="middle"
              />
            </div>
          </div>
        </Segment>
      );
    });
  }

  private getItems = (localItems: string[]): any[] => {
    return localItems.map((item) => {
      const getItem = localStorage.getItem(item);
      if (getItem) {
        return JSON.parse(getItem);
      } else {
        return {
          checked: false,
          value: item,
          date: currentTime(),
        };
      }
    });
  };

  private editItem(e: FormEvent<HTMLFormElement>) {
    this.setState({ editItem: true });
    console.log("editItem");
    console.log("e :", e);
    if (this.state.editItem) {
      const itemValue = e.currentTarget.getAttribute("name");
      e.currentTarget.innerHTML =
        '<input type="text" value="' + itemValue + '"/>';
      // debugger;
    }
  }

  private addItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.state.item.length < 1) {
      return;
    }

    try {
      let jsonItem: any;
      let getItem: string | null = localStorage.getItem(this.state.item);

      if (getItem) {
        jsonItem = JSON.parse(getItem);
      } else {
        jsonItem = {
          checked: false,
          value: this.state.item,
          date: currentTime(),
        };
      }
      const localItems = [...this.state.localItems, this.state.item];
      const items = [...this.state.items, jsonItem];
      this.setState({ localItems, items, item: "" });

      localStorage.setItem("local", localItems.toString());
      localStorage.setItem(this.state.item, JSON.stringify(jsonItem));
      e.currentTarget.addTodo.value = "";
    } catch (err) {
      console.log("Error", err);
    }
  }

  private handleItemChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ item: e.target.value });
  }

  private handleCheckboxChange = (
    e: React.FormEvent<HTMLInputElement>,
    data: CheckboxProps
  ): void => {
    let item: any;
    let storageItem: string | null = localStorage.getItem(data.name!);

    debugger;
    if (storageItem) {
      item = JSON.parse(storageItem);
      item.checked = !item.checked;
      localStorage.setItem(item.value, JSON.stringify(item));
      this.setState((prevState, props) => ({
        items: this.updateItemCheckbox(item, prevState.items),
      }));
    }
  };

  private updateItemCheckbox = (item: any, items: any): any => {
    return items.map((prevItem: any) => {
      debugger;
      if (prevItem.value === item.value) {
        prevItem.checked = item.checked;
      }
      return prevItem;
    });
  };
}

export default TodoHub;

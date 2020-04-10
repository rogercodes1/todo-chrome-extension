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
  item: string;
  items: string[];
}

class TodoHub extends React.Component<IHubProps, IHubState> {
  constructor(props: IHubState) {
    super(props);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.addItem = this.addItem.bind(this);

    this.state = {
      items: [],
      item: "",
    };
  }

  public async componentDidMount() {
    const local = localStorage.getItem("local");
    let localItems: string[] = local ? local.split(",") : [];

    this.setState({
      items: [...this.state.items, ...localItems],
    });
  }

  public render(): JSX.Element {
    console.log("this.state.items", this.state.items);
    return (
      <div className="main">
        <Segment className="mt-5 main-segment">
          <Header className="flex-col">
            <span>Today </span>
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
          date: "date now",
        };
      }
      const finalItems = [...this.state.items, this.state.item];
      this.setState({ items: finalItems });

      localStorage.setItem("local", finalItems.toString());
      localStorage.setItem(this.state.item, JSON.stringify(jsonItem));
      e.currentTarget.addTodo.value = "";
    } catch (err) {
      console.log("Error", err);
    }
  }

  private renderItems(): JSX.Element[] {
    let count = 0;
    return this.state.items.map((item) => {
      count++;
      return (
        <Segment key={count} vertical className="item-segment">
          <List.Item>
            <Checkbox onClick={this.handleCheckboxClick} />
            <List.Icon name="github" size="large" verticalAlign="middle" />
            <List.Content name={item} content={item} />
            <div></div>
            <div className="item-options">
              <List.Icon
                className="edit-item"
                name="edit"
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
          </List.Item>
        </Segment>
      );
    });
  }

  private handleItemChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ item: e.target.value });
  }

  private handleCheckboxClick = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    data: CheckboxProps
  ): void => {
    console.log(e);
    console.log(data);
  };
}

export default TodoHub;

import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import styled from 'styled-components'

const { width, height } = Dimensions.get("window");

const LottoNumberCircleBox = styled.View`
  width: 30px;
  height: 30px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.5);
`

export default class LottoNumbers extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, toDoValue: props.text };
  }
  static propTypes = {
    number: PropTypes.array.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteNumber: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
  };
  render() {
    const { isEditing, toDoValue } = this.state;
    const { number, id, deleteNumber, isCompleted, uncompleteToDo, completeToDo } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
              {number && number.map((v) => {
                  return (
                      <LottoNumberCircleBox>
                          <Text
                              style={[
                                      // styles.text,
                                      // isCompleted ? styles.completedText : styles.uncompletedText
                                      // styles.uncompletedText
                                  ]}
                              >
                                  {v}
                          </Text>
                      </LottoNumberCircleBox>
                  )
              })}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPressOut={event => {
                event.stopPropagation;
                deleteNumber(id);
              }}
            >
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20,
    color: 'white'
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    // color: "#353839"
    color: 'white'
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  actions: {
    flexDirection: "row",
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    width: width / 2,
    marginVertical: 15,
    paddingBottom: 5
  }
});
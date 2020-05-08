import React, { Component } from 'react';
import {View, Text, Animated, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import _ from 'lodash'

const GridContainer = styled.View`
    padding: 30px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`

const GameSetCircle = styled.View`
    border: 2px solid #fff;
    border: 1px solid ${props => (props.includeWin ? '#4d4c7d' : 'black')};
    background-color: ${props => (props.includeWin ? '#4d4c7d' : 'transparent')};
    width: 45px;
    height: 45px;
    border-radius: 45px;
    justify-content: center;
    align-items: center;
`

const GameSetText = styled.Text`
    color: ${props => (props.includeWin ? 'white' : 'black')};
    font-weight: bold;
`

export default class SlotLotto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
            win: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            startGameStateRandom: true,
            startGameState: false
        };
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    }

    forceUpdateHandler = () => {
        this.forceUpdate();
    }

    componentDidMount = async () => {
        const startGameWin = this.state.win

        for ( let i = 0 ; i < 7 ; i++){
            const winIndex = Math.floor(Math.random() * 7 + i * 6);
            startGameWin[winIndex] = 1;
        }

        this.setState({
            startGameWin
        })
    }

    startGame = () => {
        const {startGameWin} = this.state;
        const randomArray = setInterval(() => {
            this.setState({
                startGameSetWinRandom: _.shuffle(startGameWin),
            })
        }, 100)

        setTimeout(() => {
            clearInterval(randomArray)

            this.setState({
                startGameStateRandom: false,
            })
        }, 3000)

        this.setState({
            startGameState: true,
        })
    }

    render () {
        const {startGameWin, number, startGameSetWinRandom, startGameState} = this.state;
        console.log(this.state.startGameSetWinRandom, '-')
        return (
            <View style={{backgroundColor: '#4d4c7d', height: '100%'}}>
                {!startGameState && (
                    <View style={{
                        marginHorizontal: 30,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        marginVertical: 30,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.5
                    }}>
                        <GridContainer>
                            {startGameWin && startGameWin.map((v, i) => {
                                const includeWin = v === 1;
                                return (
                                    <GameSetCircle
                                        as={Animated.View}
                                        includeWin={includeWin}
                                        style={[
                                            // ( i > 2 && i <= 5 ) && { marginVertical: 20 },
                                        ]}
                                    >
                                        <GameSetText
                                            includeWin={includeWin}
                                        >{number[i]}</GameSetText>
                                        {/* <Image style={{width: 30, height: '100%'}} resizeMode="contain" source={startGameSetIcon[i]}/> */}
                                    </GameSetCircle>
                                )
                            })}
                        </GridContainer>
                        <View style={{paddingHorizontal: 30, paddingBottom: 30}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.startGame()
                                }}
                                style={{
                                    width: '100%',
                                    height: 50,
                                    backgroundColor: '#4d4c7d',
                                    justifyContent: "center",
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.5
                                }}
                            >
                                <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>게임 시작하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {startGameState && (
                    <View style={{marginHorizontal: 30, backgroundColor: 'white', borderRadius: 20, marginVertical: 30}}>
                        <GridContainer>
                            {startGameSetWinRandom && startGameSetWinRandom.map((v, i) => {
                                const includeWin = v === 1;
                                
                                return (
                                    <GameSetCircle
                                        as={Animated.View}
                                        includeWin={includeWin}
                                        style={[
                                        ]}
                                    >
                                        {/* <TouchableOpacity
                                            onPress={}
                                        > */}
                                            <GameSetText
                                                includeWin={includeWin}
                                            >{number[i]}</GameSetText>
                                        {/* </TouchableOpacity> */}
                                    </GameSetCircle>
                                )
                            })}
                        </GridContainer>
                        <View style={{paddingHorizontal: 30, paddingBottom: 30}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.startGame()
                                }}
                                style={{width: '100%', height: 50, backgroundColor: '#4d4c7d', justifyContent: "center", alignItems: 'center', borderRadius: 10}}
                            >
                                <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>게임 시작하기</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                )}
            </View>
        )
    }
}
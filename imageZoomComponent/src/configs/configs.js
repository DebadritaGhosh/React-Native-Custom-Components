import { Dimensions } from "react-native";

let dim = Dimensions.get('window');

export const screenSize = {
    width: dim.width,
    height: dim.height
}
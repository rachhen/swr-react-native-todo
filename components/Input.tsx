import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";

type InputProps = TextInputProps & {
  onAdd?: () => void;
};

const Input = ({ onAdd, ...props }: InputProps) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        placeholder="Enter todo ..."
        style={styles.textInput}
        {...props}
      />
      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.5}
        onPress={onAdd}
      >
        <Text style={styles.btnText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  textInput: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#eaeaea",
  },
  addBtn: {
    padding: 12,
    marginLeft: 12,
    borderRadius: 5,
    backgroundColor: "red",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});

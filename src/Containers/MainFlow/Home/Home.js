import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {totalSize, height, width} from 'react-native-dimension';
import commonStyles from '../../Styles/commonStyles';
import colors from '../../../Themes/Colors';
import DropDownFilter from '../../../Components/DropDownFilter';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {Icon} from 'react-native-elements';
import {LanguageConsumer} from '../../../Context/LanguageContext';
import {translations} from '../../../Translations/Translations.js';

const items = [
  // this is the parent or 'item'
  {
    name: 'Jobs',
    id: 0,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Waiter',
        id: 1,
      },
      {
        name: 'Designer',
        id: 2,
      },
      {
        name: 'Singer',
        id: 3,
      },
      {
        name: 'Actor',
        id: 4,
      },
      {
        name: 'Architect',
        id: 5,
      },
      {
        name: 'Teacher',
        id: 6,
      },
    ],
  },
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    };
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  _renderChips = () => {
    const {selectedItems} = this.state;
    return (
      selectedItems.length > 0 && (
        <TouchableHighlight style={styles.chipsContainer}>
          <View style={{flexDirection: 'row'}}>
            {selectedItems.map((singleSelectedItem, index) => {
              return (
                <View style={styles.singleChipContainer}>
                  <Text numberOfLines={1} style={styles.chipText}>
                    {Object.values(items[0].children).map(key => {
                      if (key.id === singleSelectedItem) {
                        return key.name;
                      }
                    })}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.removeSelectedItem(index);
                    }}>
                    <Icon
                      name="times-circle"
                      type="font-awesome"
                      iconStyle={styles.chipIcon}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </TouchableHighlight>
      )
    );
  };

  removeSelectedItem = itemIndex => {
    const {selectedItems} = this.state;
    const Items = selectedItems.slice();
    Items.splice(itemIndex, 1);
    this.setState({selectedItems: Items});
  };

  render() {
    const {selectedCity, selectedCategory} = this.props;
    const navigate = this.props.navigation.navigate;
    return (
      <LanguageConsumer>
        {props => {
          return (
            <View style={styles.mainContainer}>
              <SectionedMultiSelect
                ref={Select => (this.Select = Select)}
                items={items}
                uniqueKey="id"
                subKey="children"
                selectText={translations[props.language].jobs.category}
                showDropDowns={false}
                hideSelect={true}
                showChips={false}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
                styles={{modalWrapper: {paddingVertical: width(5)}}}
                colors={{primary: colors.appColor}}
              />

              <TouchableOpacity
                style={[commonStyles.filterContainer, {zIndex: 1}]}
                onPress={() => this.Select._toggleSelector()}>
                {this.state.selectedItems.length === 0 ? (
                  <Text style={commonStyles.filterText}>
                    {translations[props.language].jobs.searchByKeyword}
                  </Text>
                ) : (
                  <ScrollView horizontal={true}>
                    {this._renderChips()}
                  </ScrollView>
                )}
              </TouchableOpacity>

              <DropDownFilter
                label={translations[props.language].jobs.city}
                value={
                  Object.keys(selectedCity).length
                    ? selectedCity.attributes.name
                    : null
                }
                {...this.props}
              />

              <DropDownFilter
                label={translations[props.language].jobs.category}
                value={
                  Object.keys(selectedCategory).length
                    ? selectedCategory.attributes.name
                    : null
                }
                {...this.props}
              />

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={commonStyles.buttonColoredBlue}
                  onPress={() => navigate('SearchResultsScreen')}>
                  <Text style={[commonStyles.textButton, {}]}>{translations[props.language].jobs.search}</Text>
                  {this.state.loading ? (
                    <View style={commonStyles.btnLoader}>
                      <ActivityIndicator color="white" size="small" />
                    </View>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </LanguageConsumer>
    );
  }
}

Home.propTypes = {
  selectedCity: PropTypes.object,
  selectedCategory: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    selectedCity: state.city,
    selectedCategory: state.category,
  };
}

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: width(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    marginVertical: height(5),
    alignItems: 'center',
  },
  chipsContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  singleChipContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    height: 34,
    borderColor: colors.appColor1,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    margin: 3,
    paddingTop: 0,
    paddingRight: 10,
    paddingBottom: 0,
  },
  chipText: {
    color: colors.appColor1,
    fontSize: 13,
    marginRight: 0,
  },
  chipIcon: {
    color: colors.appColor1,
    fontSize: 16,
    marginHorizontal: 6,
    marginVertical: 7,
  },
});

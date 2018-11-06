/* @flow */
import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import Config from "react-native-config";
import type { NavigationScreenProp } from "react-navigation";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { createStructuredSelector } from "reselect";
import i18next from "i18next";
import { currenciesSelector } from "../../reducers/accounts";
import type { T } from "../../types/common";
import SettingsCard from "../../components/SettingsCard";
import PoweredByLedger from "./PoweredByLedger";
import Assets from "../../icons/Assets";
import LiveLogoIcon from "../../icons/LiveLogoIcon";
import Help from "../../icons/Help";
import Display from "../../icons/Display";
import colors from "../../colors";

type Props = {
  navigation: NavigationScreenProp<*>,
  currencies: CryptoCurrency[],
  t: T,
};

const mapStateToProps = createStructuredSelector({
  currencies: currenciesSelector,
});
class Settings extends Component<Props, *> {
  static navigationOptions = {
    title: i18next.t("settings.header"),
  };

  state = {
    debugVisible: Config.FORCE_DEBUG_VISIBLE || false,
  };

  navigateTo = (screenName: string) => {
    const { navigation, currencies } = this.props;
    if (screenName === "CurrencySettings") {
      return currencies.length < 2
        ? navigation.navigate("CurrencySettings", {
            currencyId: currencies[0].id,
          })
        : navigation.navigate("CurrenciesList");
    }
    return navigation.navigate(screenName);
  };

  count = 0;

  debugTimeout: *;

  onDebugHiddenPress = () => {
    clearTimeout(this.debugTimeout);
    if (this.count++ > 6) {
      this.setState({ debugVisible: true });
    } else {
      this.debugTimeout = setTimeout(() => {
        this.count = 1;
      }, 1000);
    }
  };

  render() {
    const { t, currencies } = this.props;
    const { debugVisible } = this.state;
    return (
      <ScrollView>
        <View style={styles.root}>
          <SettingsCard
            title={t("settings.display.title")}
            desc={t("settings.display.desc")}
            icon={<Display size={16} color={colors.live} />}
            onClick={() => this.navigateTo("GeneralSettings")}
          />
          {currencies.length > 0 && (
            <SettingsCard
              title={t("settings.currencies.title")}
              desc={t("settings.currencies.desc")}
              icon={<Assets size={16} color={colors.live} />}
              onClick={() => this.navigateTo("CurrencySettings")}
            />
          )}
          <SettingsCard
            title={t("settings.about.title")}
            desc={t("settings.about.desc")}
            icon={<LiveLogoIcon size={16} color={colors.live} />}
            onClick={() => this.navigateTo("AboutSettings")}
          />
          <SettingsCard
            title={t("settings.help.title")}
            desc={t("settings.help.desc")}
            icon={<Help size={16} color={colors.live} />}
            onClick={() => this.navigateTo("HelpSettings")}
          />
          {debugVisible ? (
            <SettingsCard
              title="Debug"
              desc="Use at your own risk – Developer tools"
              icon={<Icon name="wind" size={16} color={colors.live} />}
              onClick={() => this.navigateTo("DebugSettings")}
            />
          ) : (
            <TouchableWithoutFeedback onPress={this.onDebugHiddenPress}>
              <View style={{ height: 50 }} />
            </TouchableWithoutFeedback>
          )}
          <PoweredByLedger />
        </View>
      </ScrollView>
    );
  }
}

export default compose(
  connect(mapStateToProps),
  translate(),
)(Settings);

const styles = StyleSheet.create({
  root: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
});

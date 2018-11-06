/* @flow */
import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import { View, Linking, StyleSheet } from "react-native";
import SettingsRow from "../../../components/SettingsRow";
import type { T } from "../../../types/common";
import colors from "../../../colors";
import { urls } from "../../../config/urls";
import ExternalLink from "../../../icons/ExternalLink";

class PrivacyPolicyRow extends PureComponent<{
  t: T,
}> {
  render() {
    const { t } = this.props;
    return (
      <SettingsRow
        title={t("settings.about.privacyPolicy")}
        desc={t("settings.about.privacyPolicyDesc")}
        onPress={() =>
          Linking.openURL(urls.privacyPolicy).catch(err =>
            console.error("An error occurred", err),
          )
        }
        alignedTop
      >
        <View style={styles.externalLinkContainer}>
          <ExternalLink size={16} color={colors.grey} />
        </View>
      </SettingsRow>
    );
  }
}

const styles = StyleSheet.create({
  externalLinkContainer: { marginHorizontal: 10 },
});

export default translate()(PrivacyPolicyRow);

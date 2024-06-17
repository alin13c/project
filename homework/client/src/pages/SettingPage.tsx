import React, { useEffect, useState } from "react";
import { Switch, message, Dropdown, Menu } from "antd";
import axios from "axios";
import { SettingOutlined } from "@ant-design/icons";

const LANGUAGES = {
  zh: { label: "中文", value: "zh" },
  en: { label: "English", value: "en" },
};

const SettingPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.zh.value);

  useEffect(() => {
    // 初始化时获取语言设置
    fetchLanguageSetting();
  }, []);

  const fetchLanguageSetting = async () => {
    try {
      const response = await axios.get("/api/lang");
      setSelectedLanguage(response.data.data);
    } catch (error) {
      console.error("Error fetching language:", error);
      message.error("Failed to load language setting");
    }
  };

  const saveLanguageSetting = async (lang: string) => {
    try {
      await axios.post("/api/lang", { lang });
      message.success("Language setting saved successfully");
    } catch (error) {
      console.error("Error saving language:", error);
      message.error("Failed to save language setting");
    }
  };

  const handleLanguageChange = (langValue: string) => {
    if (langValue !== selectedLanguage) {
      setSelectedLanguage(langValue);
      saveLanguageSetting(langValue);
    }
  };


  const menu = (
    <Menu>
      <Menu.Item>
        <Switch
          checked={selectedLanguage === LANGUAGES.en.value}
          onChange={() =>
            handleLanguageChange(
              selectedLanguage === LANGUAGES.en.value
                ? LANGUAGES.zh.value
                : LANGUAGES.en.value
            )
          }
          checkedChildren={LANGUAGES.en.label}
          unCheckedChildren={LANGUAGES.zh.label}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <SettingOutlined
        style={{ fontSize: "20px", cursor: "pointer", color: "white" }}
      />
    </Dropdown>
  );
};

export default SettingPage;

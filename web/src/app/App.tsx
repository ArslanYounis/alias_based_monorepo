import { useState } from "react";
import {
  AddButton,
  Avatar,
  Bot,
  Breadcrumb,
  Buttons,
  Caption,
  Checkbox,
  CheckRadioLabel,
  Container,
  CustomDrawer,
  DateInput,
  DummyComponent,
  Fields,
  Footer,
  Header,
  IconButton,
  LargeComponent,
  Layout,
  Label,
  Logo,
  PlotSearch,
  ProfileIconStatus,
  RadioCard,
  Text,
  TextInput,
  Tooltip,
} from "../../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [fieldsValue, setFieldsValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");
  const [radioCardClicked, setRadioCardClicked] = useState(false);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Layout>
        <div
          style={{
            padding: "20px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Header
            </h2>
            <Header
              breadcrumbItems={[
                { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
                {
                  label: "Level 1",
                  label_ar: "المستوى 1",
                  onClick: () => {},
                },
              ]}
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Footer
            </h2>
            <Footer />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Bot
            </h2>
            <Bot />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Logo
            </h2>
            <Logo type="full" />
            <Logo type="icon" />
            <Logo type="hub" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Text
            </h2>
            <Text>Dummy text</Text>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Label
            </h2>
            <Label label="Dummy label" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Fields
            </h2>
            <Fields
              type="text"
              value={fieldsValue}
              onChange={setFieldsValue}
              placeholder="Enter text"
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Avatar
            </h2>
            <Avatar initials="AB" />
            <Avatar
              imageUrl="https://adrec-images.mastermind-mindset.com/DefaultImg.png"
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Buttons
            </h2>
            <Buttons title="Primary" type="primary" />
            <Buttons title="Secondary" type="secondary" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              AddButton
            </h2>
            <AddButton onClick={() => {}} />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Tooltip
            </h2>
            <Tooltip text="Dummy tooltip" direction="bottom-center" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Caption
            </h2>
            <Caption captionLeft="Left" captionRight="Right" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Checkbox
            </h2>
            <Checkbox
              id="demo-checkbox"
              checked={checkboxChecked}
              onChange={(_id, checked) => setCheckboxChecked(checked)}
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              TextInput
            </h2>
            <TextInput
              label="Field label"
              value={textInputValue}
              onChange={setTextInputValue}
              placeholder="Placeholder"
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              DateInput
            </h2>
            <DateInput />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              RadioCard
            </h2>
            <RadioCard
              label="Option A"
              clicked={radioCardClicked}
              onClick={() => setRadioCardClicked(!radioCardClicked)}
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Breadcrumb
            </h2>
            <Breadcrumb
              items={[
                { label: "Home", onClick: () => {} },
                { label: "Level 1", onClick: () => {} },
                { label: "Current", onClick: () => {} },
              ]}
              selectedItemIndex={2}
            />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              IconButton
            </h2>
            <IconButton icon={<span>⚙</span>} />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              CheckRadioLabel
            </h2>
            <CheckRadioLabel label="Checkbox label" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              ProfileIconStatus
            </h2>
            <ProfileIconStatus status="complete" />
            <ProfileIconStatus status="inProgress" />
            <ProfileIconStatus status="pending" />
            <ProfileIconStatus status="failed" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              CustomDrawer (trigger)
            </h2>
            <Buttons
              title={drawerOpen ? "Close drawer" : "Open drawer"}
              type="primary"
              onClick={() => setDrawerOpen(!drawerOpen)}
            />
            <CustomDrawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              dismissible
            >
              <p>Drawer content</p>
            </CustomDrawer>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Container
            </h2>
            <Container>
              <p>Container children</p>
            </Container>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              DummyComponent
            </h2>
            <DummyComponent title="Dummy title" />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              LargeComponent
            </h2>
            <LargeComponent />
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              PlotSearch
            </h2>
            <PlotSearch />
          </section>
        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;

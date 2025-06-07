import { COLORS, LabelXSmall, PROGRESS_BAR_SIZE, ProgressBar } from "@nilfoundation/ui-kit";
import { useStyletron } from "baseui";
import { useUnit } from "effector-react";
import { expandProperty } from "inline-style-expand-shorthand";
import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AccountPane } from "../../features/account-connector";
import { Code } from "../../features/code/Code";
import { loadedPlaygroundPage } from "../../features/code/model";
import { ContractsContainer, closeApp } from "../../features/contracts";
import { NetworkErrorNotification } from "../../features/healthcheck";
import { $rpcIsHealthy } from "../../features/healthcheck/model";
import { Logs } from "../../features/logs/components/Logs";
import { useMobile } from "../../features/shared";
import { Logo } from "../../features/shared/components/Layout/Logo";
import { Navbar } from "../../features/shared/components/Layout/Navbar";
import { mobileContainerStyle, styles } from "../../features/shared/components/Layout/styles";
import { fetchSolidityCompiler } from "../../services/compiler";
import { PlaygroundMobileLayout } from "./PlaygroundMobileLayout";
import { $activeComponent, LayoutComponent } from "./model";

export const PlaygroundPage = () => {
  const [isDownloading, isRPCHealthy, activeComponent] = useUnit([
    fetchSolidityCompiler.pending,
    $rpcIsHealthy,
    $activeComponent,
  ]);
  const [css] = useStyletron();
  const [isMobile] = useMobile();
  const displayNavbar = !isMobile || activeComponent === LayoutComponent.Code;

  useEffect(() => {
    loadedPlaygroundPage();

    return () => {
      closeApp();
    };
  }, []);

  return (
    <div className={css(isMobile ? mobileContainerStyle : styles.playgroundContainer)}>
      {!isRPCHealthy && <NetworkErrorNotification />}
      {displayNavbar && (
        <Navbar
          showCodeInteractionButtons={true}
          logo={
            <Logo subtitle={<LabelXSmall color={COLORS.gray400}>Playground v1.0</LabelXSmall>} />
          }
        >
          {isMobile ? null : <AccountPane />}
        </Navbar>
      )}
      <div
        className={css({
          width: "100%",
          height: "calc(100vh - 90px)",
          flexGrow: 1,
        })}
      >
        <div
          className={css({
            width: "100%",
            height: "100%",
          })}
        >
          {isMobile ? (
            <PlaygroundMobileLayout />
          ) : (
            <>
              <PanelGroup direction="horizontal" autoSaveId="playground-layout-horizontal">
                <Panel>
                  <PanelGroup direction="vertical" autoSaveId="playground-layout-vertical">
                    <Panel
                      className={css({
                        ...expandProperty("borderRadius", "12px"),
                      })}
                      minSize={10}
                      order={1}
                    >
                      <Code />
                    </Panel>
                    <PanelResizeHandle
                      className={css({
                        height: "8px",
                      })}
                    />
                    <Panel
                      className={css({
                        ...expandProperty("borderRadius", "12px"),
                        overflow: "auto!important",
                      })}
                      minSize={5}
                      defaultSize={25}
                      maxSize={90}
                      order={2}
                    >
                      <Logs />
                    </Panel>
                  </PanelGroup>
                </Panel>
                <PanelResizeHandle
                  className={css({
                    width: "8px",
                  })}
                />
                <Panel minSize={20} defaultSize={33} maxSize={90}>
                  <ContractsContainer />
                </Panel>
              </PanelGroup>
            </>
          )}
        </div>
        {isDownloading && (
          <ProgressBar
            size={PROGRESS_BAR_SIZE.large}
            minValue={0}
            maxValue={100}
            value={1}
            infinite
          />
        )}
      </div>
    </div>
  );
};

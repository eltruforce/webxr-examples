import { Group, Title, List, Anchor, AppShell } from "@mantine/core";

import Link from "next/link";

function HomePage() {
  return (
    <AppShell>
      <Title align="center" mb="xl" pb="xl">
        Learn about WebXR with ThreeJS and React Three Fiber
      </Title>
      <Title align="center" order={3} mb="sm">
        Gear links
      </Title>
      <List style={{ listStyleType: "none", textAlign: "center" }} spacing="xs">
        <List.Item>
          <Group>
            First Gear
            <Anchor href="three/FirstGear">Go 3JS!</Anchor>
            {/* Observation: In the case of R3F you can use Link component from NextJS because the render is not affected when navigate across the page. This is due to the fact that React Three Fiber is built on top of React, which means that it uses React's virtual DOM to manage its rendering. In contrast, 3JS does not use React, so it's not aware of the virtual DOM. When you navigate using Link in NextJS can cause performance issues.*/}
            {/* <Anchor href="react-three/FirstGear">Go R3F!</Anchor> */}
            <Link href="react-three/FirstGear" passHref scroll={false}>
              <Anchor> Go R3F!</Anchor>
            </Link>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Second Gear
            <Anchor href="three/SecondGear">Go 3JS!</Anchor>
            <Anchor href="react-three/SecondGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Third Gear
            <Anchor href="three/ThirdGear">Go 3JS!</Anchor>
            <Anchor href="react-three/ThirdGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Fourth Gear
            <Anchor href="three/FourthGear">Go 3JS!</Anchor>
            <Anchor href="react-three/FourthGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Fifth Gear
            <Anchor href="three/FifthGear">Go 3JS!</Anchor>
            <Anchor href="react-three/FifthGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Sixth Gear
            <Anchor href="three/SixthGear">Go 3JS!</Anchor>
            <Anchor href="react-three/SixthGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Seventh Gear
            <Anchor href="three/SeventhGear">Go 3JS!</Anchor>
            <Anchor href="react-three/SeventhGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Eighth Gear
            <Anchor href="three/EighthGear">Go 3JS!</Anchor>
            <Anchor href="react-three/EighthGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            Nineth Gear
            <Anchor href="three/NinethGear">Go 3JS!</Anchor>
            <Anchor href="react-three/NinethGear">Go R3F!</Anchor>
          </Group>
        </List.Item>
      </List>
    </AppShell>
  );
}

export default HomePage;

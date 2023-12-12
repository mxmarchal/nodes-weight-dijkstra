import { useCallback, useMemo, useState } from "react";
import { PriorityQueue } from "./PriorityQueue";
import "./App.css";

type Node = {
  uuid: string;
  x: number;
  y: number;
  name: string;
};

type Path = {
  from: string;
  to: string;
  coordinates: { x: number; y: number }[];
  distance: number;
};

function dijkstra(
  nodes: Node[],
  paths: Path[],
  startUuid: string,
  endUuid: string
): string[] {
  // Map to store the shortest distances
  const distances: { [key: string]: number } = {};
  nodes.forEach((node) => (distances[node.uuid] = Infinity));
  distances[startUuid] = 0;

  // Map to store the predecessors
  const predecessors: { [key: string]: string | null } = {};

  // Priority queue for the nodes
  const queue = new PriorityQueue<string>(
    (a, b) => distances[a] < distances[b]
  );
  queue.enqueue(startUuid);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode === endUuid) break;
    if (currentNode === undefined) continue;

    // Find all neighbors of the current node
    const neighbors = paths.filter(
      (path) => path.from === currentNode || path.to === currentNode
    );

    for (const neighbor of neighbors) {
      const neighborNode =
        neighbor.from === currentNode ? neighbor.to : neighbor.from;
      const newDistance = distances[currentNode] + neighbor.distance;

      if (newDistance < distances[neighborNode]) {
        distances[neighborNode] = newDistance;
        predecessors[neighborNode] = currentNode;
        queue.enqueue(neighborNode);
      }
    }
  }

  // Backtrack to find the shortest path
  const path: string[] = [];
  let currentUuid = endUuid;

  while (currentUuid !== startUuid) {
    path.unshift(currentUuid);
    const nextUuid = predecessors[currentUuid];

    if (nextUuid === null || nextUuid === undefined) {
      // Handle the case where no path exists
      return []; // Or any other appropriate handling
    }

    currentUuid = nextUuid;
  }
  path.unshift(startUuid);

  return path;
}

function Node({ node }: { node: Node }) {
  return <circle cx={node.x * 50} cy={node.y * 50} r={10} fill="blue" />;
}

function App() {
  const [currentNodeSelected, setCurrentNodeSelected] = useState<string | null>(
    null
  );
  const [currentNodeHover, setCurrentNodeHover] = useState<string | null>(null);

  const padding = 20;
  const svgWidth = 800;
  const svgHeight = 600;
  const scale = 20;

  const nodes = useMemo<Node[]>(
    () => [
      {
        uuid: "53971515-7947-427e-b63a-8be1fdf62667",
        x: 0,
        y: 0,
        name: "City 1",
      },
      {
        uuid: "f6f8d1af-8d53-4ce3-b58b-e9f1d1fcc276",
        x: 10,
        y: 10,
        name: "City 2",
      },
      {
        uuid: "f3d3d845-8528-4d93-be02-2a7a86bfaf40",
        x: 10,
        y: 5,
        name: "City 3",
      },
      {
        uuid: "f3d3d845-8528-4d93-be02-2a7a86bfaf41",
        x: 15,
        y: 15,
        name: "City 4",
      },
      {
        uuid: "f3d3d845-8528-4d93-be02-2a7a86bfaf42",
        x: 0,
        y: 20,
        name: "City 5",
      },
      {
        uuid: "f3d3d845-8528-4d93-be02-2a7a86bfaf43",
        x: 20,
        y: 0,
        name: "City 6",
      },
      {
        uuid: "f3d3d845-8528-4d93-be02-2a7a86bfaf44",
        x: 20,
        y: 20,
        name: "City 7",
      },
    ],
    []
  );

  const paths = useMemo<Path[]>(
    () => [
      {
        from: "53971515-7947-427e-b63a-8be1fdf62667",
        to: "f6f8d1af-8d53-4ce3-b58b-e9f1d1fcc276",
        coordinates: [
          { x: 0, y: 0 },
          { x: 3, y: 3 },
          { x: 3, y: 5 },
          { x: 5, y: 5 },
          { x: 8, y: 5 },
          { x: 10, y: 10 },
        ],
        distance: 20,
      },
      {
        from: "f6f8d1af-8d53-4ce3-b58b-e9f1d1fcc276", // City 2
        to: "f3d3d845-8528-4d93-be02-2a7a86bfaf40", // City 3
        coordinates: [
          { x: 10, y: 10 },
          { x: 10, y: 5 },
        ],
        distance: 11,
      },
      {
        from: "f3d3d845-8528-4d93-be02-2a7a86bfaf40", // City 3
        to: "53971515-7947-427e-b63a-8be1fdf62667", // City 1
        coordinates: [
          { x: 10, y: 5 },
          { x: 0, y: 0 },
        ],
        distance: 10,
      },
      {
        from: "f3d3d845-8528-4d93-be02-2a7a86bfaf41", // City 4
        to: "f6f8d1af-8d53-4ce3-b58b-e9f1d1fcc276", // City 2
        coordinates: [
          { x: 15, y: 15 },
          { x: 10, y: 10 },
        ],
        distance: 15,
      },
      {
        from: "f3d3d845-8528-4d93-be02-2a7a86bfaf42", // City 5
        to: "53971515-7947-427e-b63a-8be1fdf62667", // City 1
        coordinates: [
          { x: 0, y: 20 },
          { x: 5, y: 10 },
          { x: 0, y: 8 },
          { x: 0, y: 0 },
        ],
        distance: 80,
      },
      {
        from: "f3d3d845-8528-4d93-be02-2a7a86bfaf42", // City 5
        to: "f3d3d845-8528-4d93-be02-2a7a86bfaf44", // City 7
        coordinates: [
          { x: 0, y: 20 },
          { x: 16, y: 18 },
          { x: 20, y: 20 },
        ],
        distance: 50,
      },
      {
        from: "f3d3d845-8528-4d93-be02-2a7a86bfaf41", // City 4
        to: "f3d3d845-8528-4d93-be02-2a7a86bfaf42", // City 5
        coordinates: [
          { x: 15, y: 15 },
          { x: 10, y: 15 },
          { x: 0, y: 20 },
        ],
        distance: 25,
      },
      {
        from: "f3d3d845-8528-4d93-be02-2a7a86bfaf40", // City 3
        to: "f3d3d845-8528-4d93-be02-2a7a86bfaf43", // City 6
        coordinates: [
          { x: 10, y: 5 },
          { x: 20, y: 0 },
        ],
        distance: 15,
      },
    ],
    []
  );

  const renderPaths = useMemo(() => {
    const shortestPathSet = new Set();
    if (currentNodeSelected && currentNodeHover) {
      const shortestPath = dijkstra(
        nodes,
        paths,
        currentNodeSelected,
        currentNodeHover
      );
      for (let i = 0; i < shortestPath.length - 1; i++) {
        shortestPathSet.add(`${shortestPath[i]}-${shortestPath[i + 1]}`);
        shortestPathSet.add(`${shortestPath[i + 1]}-${shortestPath[i]}`); // If paths are bidirectional
      }
    }

    return paths.map((path, index) => {
      const points = path.coordinates
        .map(
          (coordinate) =>
            `${coordinate.x * scale + padding},${
              coordinate.y * scale + padding
            }`
        )
        .join(" ");

      const isShortestPath =
        shortestPathSet.has(`${path.from}-${path.to}`) ||
        shortestPathSet.has(`${path.to}-${path.from}`);

      return (
        <polyline
          key={index}
          points={points}
          stroke={isShortestPath ? "red" : "black"}
          strokeWidth={isShortestPath ? 4 : 2}
          fill="none"
        />
      );
    });
  }, [paths, currentNodeSelected, currentNodeHover, nodes]);

  const handleOnNodeClick = useCallback(
    (uuid: string) => () => {
      if (currentNodeSelected === uuid) {
        setCurrentNodeSelected(null);
        return;
      }
      setCurrentNodeSelected(uuid);
    },
    [currentNodeSelected]
  );

  const handleOnNodeHover = useCallback(
    (uuid: string) => () => {
      if (currentNodeSelected === null || currentNodeSelected === uuid) {
        return;
      }
      setCurrentNodeHover(uuid);
    },
    [currentNodeSelected]
  );

  const handleOnNodeHoverOut = useCallback(() => {
    setCurrentNodeHover(null);
  }, []);

  const renderShortestPathByKilometer = useMemo(() => {
    if (!currentNodeSelected || !currentNodeHover) {
      return null;
    }
    const shortestPath = dijkstra(
      nodes,
      paths,
      currentNodeSelected,
      currentNodeHover
    );
    console.log(shortestPath);
  }, [currentNodeSelected, currentNodeHover, nodes, paths]);

  const renderNodes = useMemo(() => {
    return nodes.map((node) => (
      <circle
        key={node.uuid}
        cx={node.x * scale + padding}
        cy={node.y * scale + padding}
        r={5}
        fill={
          currentNodeSelected === node.uuid
            ? "red"
            : currentNodeSelected === null
            ? "blue"
            : "grey"
        }
        onClick={handleOnNodeClick(node.uuid)}
        onMouseOver={handleOnNodeHover(node.uuid)}
        onMouseOut={handleOnNodeHoverOut}
      />
    ));
  }, [
    nodes,
    currentNodeSelected,
    handleOnNodeClick,
    handleOnNodeHover,
    handleOnNodeHoverOut,
  ]);

  return (
    <div>
      <h1>Node graph with weight</h1>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`${-padding} ${-padding} ${svgWidth - padding * 2} ${
          svgHeight - padding * 2
        }`}
        style={{ border: "1px solid black" }}
      >
        {renderPaths}
        {renderNodes}
        {renderShortestPathByKilometer}
      </svg>
      <div style={{ display: `flex` }}>
        <div style={{ flex: 1 }}>
          <h2>Nodes</h2>
          <ul>
            {nodes.map((node) => (
              <li
                key={node.uuid}
                style={{
                  color:
                    currentNodeSelected === node.uuid
                      ? "red"
                      : currentNodeHover === node.uuid
                      ? "blue"
                      : "black",
                }}
              >
                {node.name} ({node.x}, {node.y})
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Paths</h2>
          <ul>
            {paths.map((path) => (
              <li key={`${path.from}-${path.to}`}>
                {nodes.find((node) => node.uuid === path.from)?.name ||
                  "Unknown"}{" "}
                to{" "}
                {nodes.find((node) => node.uuid === path.to)?.name || "Unknown"}{" "}
                ({path.distance})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

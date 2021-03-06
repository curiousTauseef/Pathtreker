import math
import route
import networkx

def solvefile(graph, filename):
	"""Load file with pairs of intersections and calculate shortest path between them."""
	with open(filename, "r", encoding="utf-8") as infile:
		num = int(infile.readline())
		costs = [0]*num
		for i in range(num):
			source = int(infile.readline())
			dest = int(infile.readline())
			pathcost, _ = route.shortest_path(graph, source, dest)
			costs[i] = pathcost[dest]
	return costs

def testfile(graph, input_name, output_name):
	"""Test shortest path solver against correct output file."""
	EPSILON = 0.005 # km
	costs = solvefile(graph, input_name)
	costs_reference = costs
	with open(output_name, "r", encoding="utf-8") as infile:
		for i in range(len(costs)):
			theval = float(infile.readline())
			print(costs[i])
			if abs(theval - costs[i]) > EPSILON:
				print("Failed test case", input_name, i, "got", costs[i], "expected", theval, "reference", costs_reference[i])

def dotest(graph):
	testfile(graph, "sample_input.txt", "sample_output.txt")

def solveandsavefile(graph, input_name, output_name):
	costs = solvefile(graph, input_name)
	with open(output_name, "w", encoding="utf-8") as outfile:
		for c in costs:
			print(c, file=outfile)

def main():
	import loadgraph
	graph = loadgraph.buildgraph()
	solveandsavefile(graph, "input11_short", "output11_short")
	solveandsavefile(graph, "input12_long", "output12_long")

if __name__ == "__main__":
	main()

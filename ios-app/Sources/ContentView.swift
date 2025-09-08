import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Text("Fotbollsteori – Resan börjar").font(.title).bold()
                NavigationLink("Ny spelare") { Text("Ny spelare (placeholder)") }
                NavigationLink("Testa interaktivt läge") { Text("Interaktivt (placeholder)") }
            }.padding()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View { ContentView() }
}


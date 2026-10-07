// TEMGUARD Flutter App - Main Entry Point
// Framework: Flutter 3.x with Material Design 3
// State Management: BLoC Pattern
// Backend: Firebase Realtime Database

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(const TemguardApp());
}

// ===========================
// App Theme & Colors
// ===========================
class TemguardColors {
  static const Color brown50 = Color(0xFFFDF8F4);
  static const Color brown100 = Color(0xFFF8EDD8);
  static const Color brown200 = Color(0xFFF0D8B0);
  static const Color brown300 = Color(0xFFE5BE80);
  static const Color brown400 = Color(0xFFD4A05A);
  static const Color brown500 = Color(0xFFC4853D);
  static const Color brown600 = Color(0xFFA86A2D);
  static const Color brown700 = Color(0xFF8B5427);
  static const Color brown800 = Color(0xFF6D4220);
  static const Color brown900 = Color(0xFF4A2C15);
  static const Color brown950 = Color(0xFF2D1A0D);
  
  static const Color amber400 = Color(0xFFF5B942);
  static const Color emerald400 = Color(0xFF4ADE80);
  static const Color red400 = Color(0xFFF87171);
  
  static const Color bgPrimary = Color(0xFF1A110A);
  static const Color bgSecondary = Color(0xFF231710);
  static const Color bgCard = Color(0xFF2D1E14);
}

// ===========================
// Main App Widget
// ===========================
class TemguardApp extends StatelessWidget {
  const TemguardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TEMGUARD',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.dark(
          primary: TemguardColors.brown500,
          secondary: TemguardColors.amber400,
          surface: TemguardColors.bgSecondary,
          background: TemguardColors.bgPrimary,
        ),
        fontFamily: 'Outfit',
        scaffoldBackgroundColor: TemguardColors.bgPrimary,
      ),
      home: const HomeScreen(),
    );
  }
}

// ===========================
// Home Screen
// ===========================
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  double _currentTemp = 4.0;
  bool _isTempOptimal = true;

  final List<Widget> _screens = [];

  @override
  void initState() {
    super.initState();
    _screens.addAll([
      _buildDashboard(),
      _buildMechanismScreen(),
      _buildTemperatureScreen(),
      _buildSettingsScreen(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'TEMGUARD',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            letterSpacing: 2,
          ),
        ),
        centerTitle: true,
        backgroundColor: TemguardColors.brown700,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() => _selectedIndex = index);
        },
        backgroundColor: TemguardColors.bgSecondary,
        indicatorColor: TemguardColors.brown500.withOpacity(0.3),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: TemguardColors.amber400),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.biotech_outlined),
            selectedIcon: Icon(Icons.biotech, color: TemguardColors.amber400),
            label: 'Data',
          ),
          NavigationDestination(
            icon: Icon(Icons.thermostat_outlined),
            selectedIcon: Icon(Icons.thermostat, color: TemguardColors.amber400),
            label: 'Suhu',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings, color: TemguardColors.amber400),
            label: 'Setting',
          ),
        ],
      ),
    );
  }

  // ===========================
  // Dashboard Screen
  // ===========================
  Widget _buildDashboard() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Temperature Status Card
          _TemperatureStatusCard(
            currentTemp: _currentTemp,
            isOptimal: _isTempOptimal,
          ),
          const SizedBox(height: 16),
          
          // Quick Info Cards
          _InfoCard(
            icon: Icons.calendar_today,
            emoji: '📅',
            title: 'Kadaluwarsa',
            subtitle: '180 hari tersisa',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _InfoCard(
            icon: Icons.shield,
            emoji: '🛡️',
            title: 'Efektivitas',
            subtitle: '99.7% aktif',
            onTap: () {},
          ),
          const SizedBox(height: 8),
          _InfoCard(
            icon: Icons.science,
            emoji: '🔬',
            title: 'Mekanisme',
            subtitle: '5 jalur aksi',
            onTap: () {},
          ),
          
          const SizedBox(height: 24),
          
          // Mechanism Overview
          const Text(
            'Mekanisme Xanthorrhizol',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: TemguardColors.brown100,
            ),
          ),
          const SizedBox(height: 12),
          
          _MechanismTile(
            number: '01',
            title: 'Disrupsi Dinding Sel',
            description: 'Menyerang lapisan peptidoglikan, meningkatkan permeabilitas membran.',
            color: TemguardColors.brown500,
          ),
          _MechanismTile(
            number: '02',
            title: 'Gangguan Membran Sitoplasma',
            description: 'Insersi ke lipid bilayer menyebabkan depolarisasi dan lisis.',
            color: TemguardColors.amber400,
          ),
          _MechanismTile(
            number: '03',
            title: 'Inhibisi Enzim MurB',
            description: 'Memblokir biosintesis peptidoglikan dengan selektivitas tinggi.',
            color: TemguardColors.brown400,
          ),
          _MechanismTile(
            number: '04',
            title: 'Penghambatan Adhesi',
            description: 'Mencegah bakteri menempel dan membentuk komunitas biofilm.',
            color: TemguardColors.brown600,
          ),
          _MechanismTile(
            number: '05',
            title: 'Inhibisi Efflux Pump',
            description: 'Memblokir pompa efflux, meningkatkan efektivitas antibiotik.',
            color: TemguardColors.brown300,
          ),
        ],
      ),
    );
  }

  Widget _buildMechanismScreen() {
    return const Center(
      child: Text('Mechanism Data Screen', style: TextStyle(color: TemguardColors.brown100)),
    );
  }

  Widget _buildTemperatureScreen() {
    return const Center(
      child: Text('Temperature Monitor Screen', style: TextStyle(color: TemguardColors.brown100)),
    );
  }

  Widget _buildSettingsScreen() {
    return const Center(
      child: Text('Settings Screen', style: TextStyle(color: TemguardColors.brown100)),
    );
  }
}

// ===========================
// Temperature Status Card Widget
// ===========================
class _TemperatureStatusCard extends StatelessWidget {
  final double currentTemp;
  final bool isOptimal;

  const _TemperatureStatusCard({
    required this.currentTemp,
    required this.isOptimal,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: TemguardColors.bgCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isOptimal
              ? TemguardColors.emerald400.withOpacity(0.3)
              : TemguardColors.red400.withOpacity(0.3),
        ),
      ),
      child: Column(
        children: [
          // Circular Temperature Gauge
          SizedBox(
            width: 120,
            height: 120,
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 120,
                  height: 120,
                  child: CircularProgressIndicator(
                    value: 0.75,
                    strokeWidth: 8,
                    backgroundColor: Colors.white.withOpacity(0.1),
                    valueColor: AlwaysStoppedAnimation<Color>(
                      isOptimal ? TemguardColors.emerald400 : TemguardColors.red400,
                    ),
                    strokeCap: StrokeCap.round,
                  ),
                ),
                Text(
                  '${currentTemp.toStringAsFixed(0)}°C',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: isOptimal ? TemguardColors.emerald400 : TemguardColors.red400,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Suhu Saat Ini',
            style: TextStyle(
              fontSize: 12,
              color: TemguardColors.brown300,
            ),
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: isOptimal
                  ? TemguardColors.emerald400.withOpacity(0.1)
                  : TemguardColors.red400.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              isOptimal ? '● Optimal' : '● Peringatan',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isOptimal ? TemguardColors.emerald400 : TemguardColors.red400,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ===========================
// Info Card Widget
// ===========================
class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String emoji;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _InfoCard({
    required this.icon,
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: TemguardColors.bgCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: TemguardColors.brown500.withOpacity(0.15)),
        ),
        child: Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: TemguardColors.brown100,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11,
                      color: TemguardColors.brown400,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right,
              color: TemguardColors.brown400,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}

// ===========================
// Mechanism Tile Widget
// ===========================
class _MechanismTile extends StatelessWidget {
  final String number;
  final String title;
  final String description;
  final Color color;

  const _MechanismTile({
    required this.number,
    required this.title,
    required this.description,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: TemguardColors.bgCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: Text(
              number,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: color,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: TemguardColors.brown100,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 12,
                    color: TemguardColors.brown400,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
